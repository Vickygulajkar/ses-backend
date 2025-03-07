const SES = (app) => {
    app.use("/alumni-member", require("../app/alumniMembers/AlumniMembers.router"));
    app.use("/admission", require('../app/admission/Admission.route'));
    app.use("/auth", require('../app/login/loginRoutes'));
}
module.exports=SES;