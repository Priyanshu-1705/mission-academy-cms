export const enquiryNotificationTemplate = (enquiry) => `
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
    max-width:700px;
    margin:30px auto;
    background:white;
    border-radius:12px;
    overflow:hidden;
}
.header{
    background:#0f766e;
    color:white;
    text-align:center;
    padding:24px;
}
.content{
    padding:30px;
}
table{
    width:100%;
    border-collapse:collapse;
}
td{
    border:1px solid #e5e7eb;
    padding:12px;
}
td:first-child{
    width:30%;
    background:#f8fafc;
    font-weight:bold;
}
.footer{
    text-align:center;
    background:#f8fafc;
    padding:18px;
    color:#666;
}
</style>
</head>

<body>

<div class="card">

<div class="header">
<h2>New Website Enquiry</h2>
</div>

<div class="content">

<table>

<tr>
<td>Name</td>
<td>${enquiry.name}</td>
</tr>

<tr>
<td>Email</td>
<td>${enquiry.email || "N/A"}</td>
</tr>

<tr>
<td>Phone</td>
<td>${enquiry.phone}</td>
</tr>

<tr>
<td>Subject</td>
<td>${enquiry.subject || "General Enquiry"}</td>
</tr>

<tr>
<td>Message</td>
<td>${enquiry.message}</td>
</tr>

<tr>
<td>Submitted On</td>
<td>${new Date().toLocaleString()}</td>
</tr>

</table>

</div>

<div class="footer">
Mission Academy Baheri Website
</div>

</div>

</body>

</html>
`;