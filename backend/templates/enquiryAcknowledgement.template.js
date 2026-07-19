export const enquiryAcknowledgementTemplate = (enquiry) => `
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
}
.header{
    background:#0f766e;
    color:white;
    padding:24px;
    text-align:center;
}
.content{
    padding:30px;
    line-height:1.8;
}
.footer{
    background:#f8fafc;
    padding:18px;
    text-align:center;
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

<p>Dear ${enquiry.name},</p>

<p>
Thank you for contacting Mission Academy Baheri.
</p>

<p>
We have successfully received your enquiry. Our team will review your
message and get back to you as soon as possible.
</p>

<p>
We appreciate your interest in our institution and look forward to
assisting you.
</p>

<p>
Warm regards,<br>
Mission Academy Baheri
</p>

</div>

<div class="footer">
This is an automated email. Please do not reply to this message.
</div>

</div>

</body>

</html>
`;