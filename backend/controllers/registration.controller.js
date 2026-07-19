import Registration from "../models/Registration.model.js";
import { isValidObjectId } from "../utils/isValidObjectId.util.js";
import { sendMail } from "../utils/mailService.util.js";
import { registrationAcknowledgementTemplate } from "../templates/registrationAcknowledgement.template.js";
import { registrationNotificationTemplate } from "../templates/registrationNotification.template.js";
const VALID_CLASSES = [
    "Nursery",
    "LKG",
    "UKG",
    "Class I",
    "Class II",
    "Class III",
    "Class IV",
    "Class V",
    "Class VI",
    "Class VII",
    "Class VIII",
    "Class IX",
    "Class X",
    "Class XI",
    "Class XII"
];

const VALID_GENDERS = [
    "male",
    "female",
    "other"
];

const VALID_STATUS = [
    "pending",
    "approved",
    "rejected"
];


/**
 * Registration Controller
 *
 * Purpose:
 * Handles all CRUD operations for student admission registrations.
 *
 * Responsibilities:
 * - Create a new registration.
 * - Fetch registrations (admin: all; public: not applicable).
 * - Update an existing registration's status.
 * - Delete a registration.
 *
 * Notes:
 * Only Super Admin and Principal can view and update registrations.
 * There is no public-facing GET route for registrations.
 */

/**
 * Builds the MongoDB filter object for searching and filtering
 * registrations.
 *
 * Supports:
 * - classApplied
 * - status
 */
const buildRegistrationFilter = (query) => {
    const filter = {};

    // Filter by class
    if (query.classApplied?.trim()) {
        filter.classApplied = query.classApplied.trim();
    }

    // Filter by status
    if (query.status?.trim()) {
        filter.status = query.status.trim();
    }

    return filter;
};


const fetchRegistrations = async (query) => {

    const filter = buildRegistrationFilter(query);

    return Registration.find(filter).sort({
        createdAt: -1
    });

};

/**
 * GET /api/registrations
 *
 * Admin-facing.
 *
 * Returns all registrations.
 * Supports optional filtering by `classApplied` and `status`
 * using query parameters.
 *
 * Examples:
 * GET /api/registrations
 * GET /api/registrations?classApplied=Nursery
 * GET /api/registrations?status=pending
 * GET /api/registrations?classApplied=Class I&status=approved
 */
export const getRegistrations = async (req, res) => {
    try {

        const registrations = await fetchRegistrations(req.query);

        return res.status(200).json({
            success: true,
            message: "Registrations retrieved successfully.",
            data: registrations
        });

    } catch (error) {

        console.error(
            "[Registration Controller] Get Registrations:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};

const validateRegistration = (data) => {
    const errors = {};

    if (!data.studentName?.trim()) {
        errors.studentName = "Student name is required.";
    }

    if (!data.dob) {
        errors.dob = "Date of birth is required.";
    } else {
        const dobDate = new Date(data.dob);

        if (Number.isNaN(dobDate.getTime())) {
            errors.dob = "Invalid date of birth.";
        }
    }

    if (!data.gender) {
        errors.gender = "Gender is required.";
    } else if (!VALID_GENDERS.includes(data.gender)) {
        errors.gender = "Invalid gender.";
    }

    if (!data.classApplied) {
        errors.classApplied = "Class applied is required.";
    } else if (!VALID_CLASSES.includes(data.classApplied)) {
        errors.classApplied = "Invalid class applied.";
    }

    if (!data.fatherName?.trim()) {
        errors.fatherName = "Father's name is required.";
    }

    if (!data.motherName?.trim()) {
        errors.motherName = "Mother's name is required.";
    }

    if (!data.parentPhone?.trim()) {
        errors.parentPhone = "Parent's phone number is required.";
    } else if (!/^[6-9]\d{9}$/.test(data.parentPhone)) {
        errors.parentPhone = "Please enter a valid 10-digit phone number.";
    }

    if (!data.email?.trim()) {
        errors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
        errors.email = "Please enter a valid email address.";
    }

    if (!data.address?.trim()) {
        errors.address = "Address is required.";
    }

    return errors;
};

const checkDuplicateRegistration = async ({
    studentName,
    dob,
    fatherName,
    classApplied
}) => {

    return Registration.findOne({
        studentName,
        dob,
        fatherName,
        classApplied,
        status: "pending"
    });

};

/**
 * POST /api/public/registrations
 *
 * Public-facing. No auth required.
 *
 * Creates a new admission registration.
 */
export const submitRegistration = async (req, res) => {
    try {
        const validationErrors = validateRegistration(req.body);

        if (Object.keys(validationErrors).length > 0) {
            return res.status(400).json({
                success: false,
                message: "Registration validation failed.",
                errors: validationErrors
            });
        }

        const {
            studentName,
            dob,
            gender,
            classApplied,
            previousSchool,
            fatherName,
            motherName,
            parentPhone,
            email,
            address
        } = req.body;

        const dobDate = new Date(dob);

        const existingRegistration =
            await checkDuplicateRegistration({
                studentName,
                dob: dobDate,
                fatherName,
                classApplied
            });

        if (existingRegistration) {
            return res.status(409).json({
                success: false,
                message: "A pending registration already exists for this student."
            });
        }

        const registration = await Registration.create({
            studentName,
            dob: dobDate,
            gender,
            classApplied,
            previousSchool,
            fatherName,
            motherName,
            parentPhone,
            email,
            address,
            status: "pending"
        });

        try {
            await sendMail({
                to: process.env.EMAIL_USER,
                subject: `New Admission Registration - ${registration.studentName}`,
                html: registrationNotificationTemplate(registration),
            });

            if (registration.email) {
                await sendMail({
                    to: registration.email,
                    subject: "Admission Registration Received | Mission Academy Baheri",
                    html: registrationAcknowledgementTemplate(registration),
                });
            }
        } catch {
            // Ignore email errors
        }

        return res.status(201).json({
            success: true,
            message: "Registration submitted successfully.",
            data: registration
        });

    } catch (error) {

        console.error(
            "[Registration Controller] Submit Registration:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};

/**
 * PATCH /api/registrations/:id/status
 *
 * Admin-facing.
 *
 * Updates the status of an existing registration.
 */
export const updateRegistrationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid registration ID."
            });
        }

        if (!status || !VALID_STATUS.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status provided. Must be 'pending', 'approved', or 'rejected'."
            });
        }

        const registration = await Registration.findById(id);

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: "Registration not found."
            });
        }

        registration.status = status;
        await registration.save();

        return res.status(200).json({
            success: true,
            message: "Registration status updated successfully.",
            data: registration
        });

    } catch (error) {
        console.error(
            "[Registration Controller] Update Registration Status:",
            error.message
        );
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}

/**
 * PATCH /api/registrations/:id
 *
 * Admin-facing.
 *
 * Updates an existing registration record.
 * Allows updating any field of the registration.
 */
export const updateRegistration = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: "Invalid registration ID." });
        }

        const { studentName, dob, gender, classApplied, previousSchool, fatherName, motherName, parentPhone, email, address, status } = req.body;

        const registration = await Registration.findById(id);

        if (!registration) {
            return res.status(404).json({ success: false, message: "Registration not found." });
        }

        // ... all the existing field-by-field validation/assignment blocks stay exactly as they are ...

        // REMOVE the "if (registration.status === status)" early-return block entirely —
        // it compares status against itself after already being reassigned, which means
        // it always triggers whenever status is included, silently discarding every
        // other field change in the same request. Just save unconditionally instead.

        await registration.save();

        return res.status(200).json({
            success: true,
            message: "Registration updated successfully.",
            data: registration
        });
    } catch (error) {
        console.error("[Registration Controller] Update Registration:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

/**
 *  DELETE /api/registrations/:id
 *
 * Admin-facing.
 *
 * Delete an existing registration record.
 */
export const deleteRegistration = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid registration ID."
            });
        }

        const registration = await Registration.findByIdAndDelete(id);

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: "Registration not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Registration deleted successfully."
        });

    } catch (error) {
        console.error(
            "[Registration Controller] Delete Registration:",
            error.message
        );
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}    