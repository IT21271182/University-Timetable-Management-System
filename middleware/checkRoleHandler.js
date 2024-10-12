const checkAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        res.status(403);
        throw new Error("Only admins can perform this action");
    }
    next();
};

const checkFacultyMember = (req, res, next) => {
    if (req.user.role !== 'facultyMember' && req.user.role !== 'admin') {
        res.status(403);
        throw new Error("Only faculty members or admins can perform this action");
    }
    next();
    
};

const checkStudent = (req, res, next) => {
    if (req.user.role !== 'student') {
        res.status(403);
        throw new Error("Only students can perform this action");
    }
    next();
    
};

module.exports = { checkAdmin , checkFacultyMember , checkStudent };