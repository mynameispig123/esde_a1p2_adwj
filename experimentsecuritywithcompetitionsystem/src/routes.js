// Import controlers
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const checkUserFn = require('./middlewares/checkUserFn');
const checkUserFnSolution = require('./middlewares/checkUserFnSolution');
const accessControlFrontEnd = require('./middlewares/accessCheckFrontEnd');


// Match URL's with controllers
exports.appRoute = router => {

    // Login & Registerings
    router.post('/api/user/login', authController.processLogin);
    router.post('/api/user/register', authController.processRegister);

    // User: Submit Design
    router.post('/api/user/process-submission', checkUserFnSolution.checkForValidUserRoleUser, checkUserFn.getClientUserId, userController.processDesignSubmission);

    // User: Send Invitation
    router.post('/api/user/processInvitation/', checkUserFn.getClientUserId, userController.processSendInvitation);
    
    // User: Manage Submission
    router.get('/api/user/process-search-design/:pagenumber/:search?', checkUserFnSolution.checkForValidUserRoleUser, checkUserFn.getClientUserId, userController.processGetSubmissionData);
    
    // User: Update Design
    router.put('/api/user/design/', checkUserFnSolution.checkForValidUserRoleUser, checkUserFn.getClientUserId, userController.processUpdateOneDesign);
    router.get('/api/user/design/:fileId', checkUserFnSolution.checkForValidUserRoleUser, checkUserFn.getClientUserId, userController.processGetOneDesignData);
    
    // Admin: Manage User
    router.get('/api/user/process-search-user/:pagenumber/:search?', checkUserFnSolution.checkForValidUserRoleUser, checkUserFn.getClientUserId, userController.processGetUserData);

    // Admin: Check User Submission
    router.get('/api/user/process-search-user-design/:pagenumber/:search?', checkUserFnSolution.checkForValidUserRoleUser, checkUserFn.getClientUserId, userController.processGetSubmissionsbyEmail);
    
    // User & Admin: Profile Page
    router.put('/api/user/', checkUserFnSolution.checkForValidUserRoleUser, checkUserFn.getClientUserId, userController.processUpdateOneUser);
    router.get('/api/user/:recordId', checkUserFnSolution.checkForValidUserRoleUser, userController.processGetOneUserData);

    // Newly Created Endpoint
    router.post('/api/user/authentication-check', checkUserFnSolution.checkForValidUserRoleUser, accessControlFrontEnd.accessCheckFrontEnd);
    // router.get('/api/user/file/:fileId', checkUserFnSolution.checkForValidUserRoleUser, checkUserFn.getClientUserId, userController.processGetUserIDFromFileId);

};