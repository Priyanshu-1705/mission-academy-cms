export const registrationAcknowledgementTemplate = (registration) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
body{
    background:#f5f7fb;
    font-family:Arial;
}
.card{
    max-width:650px;
    margin:30px auto;
    background:white;
    border-radius:12px;
    overflow:hidden;
}
.header{
    background:#0f766e;
    color:white;
    text-align:center;
    padding:25px;
}
.content{
    padding:30px;
    line-height:1.7;
}
.footer{
    text-align:center;
    padding:20px;
    background:#f8fafc;
    color:#666;
}
</style>
</head>

<body>

<div class="card">

<div class="header">
<h2>Mission Academy Baheri</h2>
</div>

<div class="content">

<p>Dear Parent,</p>

<p>
Thank you for submitting the admission registration for
<strong>${registration.studentName}</strong>.
</p>

<p>
We have successfully received your application for
<strong>${registration.classApplied}</strong>.
</p>

<p>
Our admission office will review the submitted information and
contact you shortly regarding the next steps.
</p>

<p>
If you have any questions, please contact the school office during
working hours.
</p>

<p>
Thank you for choosing Mission Academy Baheri.
</p>

<p>
Regards,<br>
Admission Office<br>
Mission Academy Baheri
</p>

</div>

<div class="footer">
This is an automated email. Please do not reply directly to this message.
</div>

</div>

</body>

</html>
`;