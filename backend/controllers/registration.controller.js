import Registration from "../models/Registration.model.js";
import { isValidObjectId } from "../utils/isValidObjectId.util.js";
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

        if (!status || !["pending", "approved", "rejected"].includes(status)) {
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
            return res.status(400).json({
                success: false,
                message: "Invalid registration ID."
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
            address,
            status
        } = req.body;

        const registration = await Registration.findById(id);

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: "Registration not found."
            });
        }

        if (studentName !== undefined) {
            if (!studentName.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Student name cannot be empty."
                });
            }
            registration.studentName = studentName;
        }

        if (dob !== undefined) {
            const dobDate = new Date(dob);
            if (isNaN(dobDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid date of birth format."
                });
            }
            registration.dob = dobDate;
        }

        if (gender !== undefined) {
            if (!["male", "female", "other"].includes(gender)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid gender. Must be 'male', 'female', or 'other'."
                });
            }
            registration.gender = gender;
        }

        if (classApplied !== undefined) {
            const validClasses = [
                "Nursery", "LKG", "UKG", "Class I", "Class II", "Class III",
                "Class IV", "Class V", "Class VI", "Class VII", "Class VIII",
                "Class IX", "Class X", "Class XI", "Class XII"
            ];
            if (!validClasses.includes(classApplied)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid class applied. Must be one of the following: " + validClasses.join(", ")
                });
            }
            registration.classApplied = classApplied;
        }

        if (previousSchool !== undefined) {
            registration.previousSchool = previousSchool;
        }

        if (fatherName !== undefined) {
            if (!fatherName.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Father's name cannot be empty."
                });
            }
            registration.fatherName = fatherName;
        }

        if (motherName !== undefined) {
            if (!motherName.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Mother's name cannot be empty."
                });
            }
            registration.motherName = motherName;
        }

        if (parentPhone !== undefined) {
            if (!/^[6-9]\d{9}$/.test(parentPhone)) {
                return res.status(400).json({
                    success: false,
                    message: "Please enter a valid phone number."
                });
            }
            registration.parentPhone = parentPhone;
        }

        if (email !== undefined) {
            if (!/^\S+@\S+\.\S+$/.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Please enter a valid email."
                });
            }
            registration.email = email;
        }

        if (address !== undefined) {
            if (!address.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Address cannot be empty."
                });
            }
            registration.address = address;
        }

        if (status !== undefined) {
            if (!["pending", "approved", "rejected"].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid status provided. Must be 'pending', 'approved', or 'rejected'."
                });
            }
            registration.status = status;
        }

        await registration.save();

        return res.status(200).json({
            success: true,
            message: "Registration updated successfully.",
            data: registration
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}

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
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}    