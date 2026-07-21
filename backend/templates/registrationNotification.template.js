export const registrationNotificationTemplate = (registration) => {
    const formattedDob = new Date(registration.dob).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    const submittedOn = new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
body{
    margin:0;
    padding:0;
    background:#f5f7fb;
    font-family:Arial,Helvetica,sans-serif;
}
.wrapper{
    max-width:700px;
    margin:30px auto;
    background:#ffffff;
    border-radius:12px;
    overflow:hidden;
    box-shadow:0 4px 15px rgba(0,0,0,.08);
}
.header{
    background:#0f766e;
    color:#fff;
    text-align:center;
    padding:28px;
}
.header h1{
    margin:0;
    font-size:24px;
}
.header p{
    margin-top:8px;
    opacity:.9;
}
.section{
    padding:30px;
}
.info{
    width:100%;
    border-collapse:collapse;
    margin-top:15px;
}
.info td{
    border:1px solid #e5e7eb;
    padding:12px;
    font-size:14px;
}
.info td:first-child{
    width:35%;
    background:#f8fafc;
    font-weight:bold;
}
.footer{
    background:#f8fafc;
    padding:18px;
    text-align:center;
    color:#6b7280;
    font-size:13px;
}
</style>
</head>

<body>

<div class="wrapper">

<div class="header">
<h1>Mission Academy Baheri</h1>
<p>New Admission Registration Received</p>
</div>

<div class="section">

<p>A new admission registration has been submitted through the school website.</p>

<table class="info">

<tr>
<td>Student Name</td>
<td>${registration.studentName}</td>
</tr>

<tr>
<td>Date of Birth</td>
<td>${formattedDob}</td>
</tr>

<tr>
<td>Gender</td>
<td>${registration.gender}</td>
</tr>

<tr>
<td>Class Applied</td>
<td>${registration.classApplied}</td>
</tr>

<tr>
<td>Previous School</td>
<td>${registration.previousSchool || "N/A"}</td>
</tr>

<tr>
<td>Father's Name</td>
<td>${registration.fatherName}</td>
</tr>

<tr>
<td>Mother's Name</td>
<td>${registration.motherName || "N/A"}</td>
</tr>

<tr>
<td>Parent Phone</td>
<td>${registration.parentPhone}</td>
</tr>

<tr>
<td>Email</td>
<td>${registration.email || "N/A"}</td>
</tr>

<tr>
<td>Address</td>
<td>${registration.address}</td>
</tr>

<tr>
<td>Submitted On</td>
<td>${submittedOn}</td>
</tr>

</table>

</div>

<div class="footer">
This email was generated automatically from the Mission Academy Baheri website.
</div>

</div>

</body>
</html>
`
};