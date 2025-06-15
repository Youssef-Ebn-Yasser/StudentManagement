namespace Backend;

public class Routing
{
    private const string SingleId = "/{id}";
    private const string root = "Api";
    private const string version = "V1";
    private const string Rule = root + "/" + version + "/";

    public static class StudentRouting
    {
        public const string Prefix = Rule + "Student";
        public const string GetList = Prefix + "/GetAll";
        public const string GetById = Prefix + SingleId;
        public const string GetByName = Prefix + "/{name}";
        public const string AddNew = Prefix + "/Create";
        public const string Update = Prefix + "/Update";
        public const string Delete = Prefix + "/Delete/{id}";
        public const string Paginated = Prefix + "/Paginated";
        public const string PagGetAllInCourseByCourseNameinated = Prefix + "PagGetAllInCourseByCourseNameinated" + "/{courseName}";
        public const string GetPaginatedCourses = Prefix + "GetPaginatedCourses" + "/{pageNumber}" + "/{pageSize}";
        public const string GetAllEnrolledStudentCourses = Prefix + "/GetAllEnrolledStudentCourses";
        public const string IsEnrolled = Prefix + "/IsEnrolled";
        public const string EnrollToCourse = Prefix + "/EnrollToCourse";
        public const string DeleteStudentFromCourse = Prefix + "/DeleteStudentFromCourse";
    }

    public static class AuthRouting
    {
        public const string Prefix = Rule + "Auth";
        public const string Login = Prefix + "/login";
        public const string GoogleLogin = Prefix + "/Googlelogin";
        public const string RegisterStudent = Prefix + "/register/student";
        public const string RegisterTeacher = Prefix + "/register/teacher";
        public const string RegisterAdmin = Prefix + "/register/admin";
        public const string RefreshToken = Prefix + "/refresh-token";
        public const string Logout = Prefix + "/logout";
        public const string ForgotPassword = Prefix + "/forgot-password";
        public const string ResetPassword = Prefix + "/reset-password";
        public const string ChangePassword = Prefix + "/change-password";
        public const string VerifyEmail = Prefix + "/verify-email";
        public const string ResendVerificationEmail = Prefix + "/resend-verification-email";
    }

    public static class AssignmentRouting
    {
        public const string Prefix = Rule + "Assignment";
        public const string GetStudentAssignmentInCourse = Prefix + "/GetStudentAssignmentInCourse";
        public const string UploadAssignment = Prefix + "/upload/assignment";
        public const string GetStudentAssignmentForLessonId = Prefix + "/GetStudentAssignmentForLessonId";
        public const string GetAllAssignmentOfCourse = Prefix + "/GetAllAssignmentOfCourse";
        public const string GetAssignmentByLessonId = Prefix + "/GetAssignmentByLessonId";
        public const string GetAssignmentForStudentToCorrect = Prefix + "/GetAssignmentForStudentToCorrect";
        public const string SaveStudentDegreeInAssignment = Prefix + "/SaveStudentDegreeInAssignment";
        public const string DeleteAssignment = Prefix + "/Delete/{id}";
        public const string UpdateAssignment = Prefix + "/Update";
        public const string GetAssignmentById = Prefix + SingleId;
        public const string GetAllAssignments = Prefix + "/GetAll";
        public const string GetAssignmentsByStudentId = Prefix + "/GetByStudentId/{studentId}";
        public const string GetAssignmentsByCourseId = Prefix + "/GetByCourseId/{courseId}";
        public const string GetAssignmentsByLessonId = Prefix + "/GetByLessonId/{lessonId}";
        public const string GetAssignmentsByStatus = Prefix + "/GetByStatus/{status}";
        public const string GetAssignmentsByDateRange = Prefix + "/GetByDateRange";
        public const string GetAssignmentsByDegreeRange = Prefix + "/GetByDegreeRange";
    }

    public static class CommentRouting
    {
        public const string Prefix = Rule + "Comment";
        public const string Create = Prefix + "/create";
        public const string Delete = Prefix + "/{commentId}";
        public const string GetAllByLessonId = Prefix + "/lesson/{lessonId}";
        public const string GetAllForStudentInLesson = Prefix + "/lesson/{lessonId}/student-comments";
        public const string Update = Prefix + "/Update";
        public const string GetById = Prefix + SingleId;
        public const string GetAll = Prefix + "/GetAll";
        public const string GetByStudentId = Prefix + "/GetByStudentId/{studentId}";
        public const string GetByLessonId = Prefix + "/GetByLessonId/{lessonId}";
        public const string GetByCourseId = Prefix + "/GetByCourseId/{courseId}";
        public const string GetByDateRange = Prefix + "/GetByDateRange";
        public const string GetByContent = Prefix + "/GetByContent/{content}";
    }

    public static class PaymentRouting
    {
        public const string Prefix = Rule + "Payment";
        public const string Create = Prefix + "/Create";
        public const string Update = Prefix + "/Update";
        public const string Delete = Prefix + "/Delete/{id}";
        public const string GetById = Prefix + SingleId;
        public const string GetAll = Prefix + "/GetAll";
        public const string GetByStudentId = Prefix + "/GetByStudentId/{studentId}";
        public const string GetByCourseId = Prefix + "/GetByCourseId/{courseId}";
        public const string GetByStatus = Prefix + "/GetByStatus/{status}";
        public const string GetByDateRange = Prefix + "/GetByDateRange";
        public const string GetByAmountRange = Prefix + "/GetByAmountRange";
        public const string GetByPaymentMethod = Prefix + "/GetByPaymentMethod/{paymentMethod}";
        public const string GetByTransactionId = Prefix + "/GetByTransactionId/{transactionId}";
        public const string GetByVodafoneNumber = Prefix + "/GetByVodafoneNumber/{vodafoneNumber}";
        public const string GetByReferenceNumber = Prefix + "/GetByReferenceNumber/{referenceNumber}";
        public const string GetByReceiptNumber = Prefix + "/GetByReceiptNumber/{receiptNumber}";
        public const string GetByReceiptImage = Prefix + "/GetByReceiptImage/{receiptImage}";
        public const string GetByNotes = Prefix + "/GetByNotes/{notes}";
        public const string GetByCreatedAt = Prefix + "/GetByCreatedAt/{createdAt}";
        public const string GetByUpdatedAt = Prefix + "/GetByUpdatedAt/{updatedAt}";
        public const string GetByIsDeleted = Prefix + "/GetByIsDeleted/{isDeleted}";
        public const string GetByIsActive = Prefix + "/GetByIsActive/{isActive}";
        public const string GetByIsPending = Prefix + "/GetByIsPending/{isPending}";
        public const string GetByIsApproved = Prefix + "/GetByIsApproved/{isApproved}";
        public const string GetByIsRejected = Prefix + "/GetByIsRejected/{isRejected}";
        public const string GetByIsCancelled = Prefix + "/GetByIsCancelled/{isCancelled}";
        public const string GetByIsCompleted = Prefix + "/GetByIsCompleted/{isCompleted}";
        public const string GetByIsFailed = Prefix + "/GetByIsFailed/{isFailed}";
        public const string GetByIsExpired = Prefix + "/GetByIsExpired/{isExpired}";
        public const string GetByIsProcessing = Prefix + "/GetByIsProcessing/{isProcessing}";
        public const string GetByIsVerified = Prefix + "/GetByIsVerified/{isVerified}";
        public const string GetByIsDeclined = Prefix + "/GetByIsDeclined/{isDeclined}";
        public const string GetByIsSuspended = Prefix + "/GetByIsSuspended/{isSuspended}";
        public const string GetByIsBlocked = Prefix + "/GetByIsBlocked/{isBlocked}";
        public const string GetByIsLocked = Prefix + "/GetByIsLocked/{isLocked}";
        public const string GetByIsUnlocked = Prefix + "/GetByIsUnlocked/{isUnlocked}";
        public const string GetByIsEnabled = Prefix + "/GetByIsEnabled/{isEnabled}";
        public const string GetByIsDisabled = Prefix + "/GetByIsDisabled/{isDisabled}";
        public const string GetByIsHidden = Prefix + "/GetByIsHidden/{isHidden}";
        public const string GetByIsVisible = Prefix + "/GetByIsVisible/{isVisible}";
        public const string GetByIsArchived = Prefix + "/GetByIsArchived/{isArchived}";
    }

    public static class CourseRouting
    {
        public const string Prefix = Rule + "Course";
        public const string Create = Prefix + "/Create";
        public const string Update = Prefix + "/Update";
        public const string Delete = Prefix + "/Delete/{id}";
        public const string GetById = Prefix + SingleId;
        public const string GetAll = Prefix + "/GetAll";
        public const string GetByTitle = Prefix + "/GetByTitle/{title}";
        public const string GetByDescription = Prefix + "/GetByDescription/{description}";
        public const string GetByLevel = Prefix + "/GetByLevel/{level}";
        public const string GetByCategoryId = Prefix + "/GetByCategoryId/{categoryId}";
        public const string GetByTeacherId = Prefix + "/GetByTeacherId/{teacherId}";
        public const string GetByPriceRange = Prefix + "/GetByPriceRange";
        public const string GetByDurationRange = Prefix + "/GetByDurationRange";
        public const string GetByDateRange = Prefix + "/GetByDateRange";
        public const string GetByIsActive = Prefix + "/GetByIsActive/{isActive}";
        public const string GetByIsDeleted = Prefix + "/GetByIsDeleted/{isDeleted}";
        public const string GetByIsPublished = Prefix + "/GetByIsPublished/{isPublished}";
        public const string GetByIsFeatured = Prefix + "/GetByIsFeatured/{isFeatured}";
        public const string GetByIsPopular = Prefix + "/GetByIsPopular/{isPopular}";
        public const string GetByIsNew = Prefix + "/GetByIsNew/{isNew}";
        public const string GetByIsRecommended = Prefix + "/GetByIsRecommended/{isRecommended}";
        public const string GetByIsTrending = Prefix + "/GetByIsTrending/{isTrending}";
        public const string GetByIsBestSeller = Prefix + "/GetByIsBestSeller/{isBestSeller}";
        public const string GetByIsTopRated = Prefix + "/GetByIsTopRated/{isTopRated}";
        public const string GetByIsMostViewed = Prefix + "/GetByIsMostViewed/{isMostViewed}";
        public const string GetByIsMostEnrolled = Prefix + "/GetByIsMostEnrolled/{isMostEnrolled}";
        public const string GetByIsMostReviewed = Prefix + "/GetByIsMostReviewed/{isMostReviewed}";
        public const string GetByIsMostRated = Prefix + "/GetByIsMostRated/{isMostRated}";
        public const string GetByIsMostCommented = Prefix + "/GetByIsMostCommented/{isMostCommented}";
        public const string GetByIsMostLiked = Prefix + "/GetByIsMostLiked/{isMostLiked}";
        public const string GetByIsMostShared = Prefix + "/GetByIsMostShared/{isMostShared}";
        public const string GetByIsMostBookmarked = Prefix + "/GetByIsMostBookmarked/{isMostBookmarked}";
        public const string GetByIsMostDownloaded = Prefix + "/GetByIsMostDownloaded/{isMostDownloaded}";
        public const string GetByIsMostPurchased = Prefix + "/GetByIsMostPurchased/{isMostPurchased}";
        public const string GetByIsMostWatched = Prefix + "/GetByIsMostWatched/{isMostWatched}";
        public const string GetByIsMostListened = Prefix + "/GetByIsMostListened/{isMostListened}";
        public const string GetByIsMostRead = Prefix + "/GetByIsMostRead/{isMostRead}";
        public const string GetByIsMostPlayed = Prefix + "/GetByIsMostPlayed/{isMostPlayed}";
        public const string GetByIsMostCompleted = Prefix + "/GetByIsMostCompleted/{isMostCompleted}";
        public const string GetByIsMostFailed = Prefix + "/GetByIsMostFailed/{isMostFailed}";
        public const string GetByIsMostAbandoned = Prefix + "/GetByIsMostAbandoned/{isMostAbandoned}";
        public const string GetByIsMostRevisited = Prefix + "/GetByIsMostRevisited/{isMostRevisited}";
        public const string GetByIsMostRecommended = Prefix + "/GetByIsMostRecommended/{isMostRecommended}";
        public const string GetByIsMostReported = Prefix + "/GetByIsMostReported/{isMostReported}";
        public const string GetByIsMostFlagged = Prefix + "/GetByIsMostFlagged/{isMostFlagged}";
        public const string GetByIsMostBlocked = Prefix + "/GetByIsMostBlocked/{isMostBlocked}";
        public const string GetByIsMostHidden = Prefix + "/GetByIsMostHidden/{isMostHidden}";
        public const string GetByIsMostArchived = Prefix + "/GetByIsMostArchived/{isMostArchived}";
    }

    public static class LessonRouting
    {
        public const string Prefix = Rule + "Lesson";
        public const string Create = Prefix + "/Create";
        public const string Update = Prefix + "/Update";
        public const string Delete = Prefix + "/Delete/{id}";
        public const string GetById = Prefix + SingleId;
        public const string GetAll = Prefix + "/GetAll";
        public const string GetByTitle = Prefix + "/GetByTitle/{title}";
        public const string GetByDescription = Prefix + "/GetByDescription/{description}";
        public const string GetByCourseId = Prefix + "/GetByCourseId/{courseId}";
        public const string GetByOrder = Prefix + "/GetByOrder/{order}";
        public const string GetByDurationRange = Prefix + "/GetByDurationRange";
        public const string GetByDateRange = Prefix + "/GetByDateRange";
        public const string GetByIsActive = Prefix + "/GetByIsActive/{isActive}";
        public const string GetByIsDeleted = Prefix + "/GetByIsDeleted/{isDeleted}";
        public const string GetByIsPublished = Prefix + "/GetByIsPublished/{isPublished}";
        public const string GetByIsFeatured = Prefix + "/GetByIsFeatured/{isFeatured}";
        public const string GetByIsPopular = Prefix + "/GetByIsPopular/{isPopular}";
        public const string GetByIsNew = Prefix + "/GetByIsNew/{isNew}";
        public const string GetByIsRecommended = Prefix + "/GetByIsRecommended/{isRecommended}";
        public const string GetByIsTrending = Prefix + "/GetByIsTrending/{isTrending}";
        public const string GetByIsBestSeller = Prefix + "/GetByIsBestSeller/{isBestSeller}";
        public const string GetByIsTopRated = Prefix + "/GetByIsTopRated/{isTopRated}";
        public const string GetByIsMostViewed = Prefix + "/GetByIsMostViewed/{isMostViewed}";
        public const string GetByIsMostEnrolled = Prefix + "/GetByIsMostEnrolled/{isMostEnrolled}";
        public const string GetByIsMostReviewed = Prefix + "/GetByIsMostReviewed/{isMostReviewed}";
        public const string GetByIsMostRated = Prefix + "/GetByIsMostRated/{isMostRated}";
        public const string GetByIsMostCommented = Prefix + "/GetByIsMostCommented/{isMostCommented}";
        public const string GetByIsMostLiked = Prefix + "/GetByIsMostLiked/{isMostLiked}";
        public const string GetByIsMostShared = Prefix + "/GetByIsMostShared/{isMostShared}";
        public const string GetByIsMostBookmarked = Prefix + "/GetByIsMostBookmarked/{isMostBookmarked}";
        public const string GetByIsMostDownloaded = Prefix + "/GetByIsMostDownloaded/{isMostDownloaded}";
        public const string GetByIsMostPurchased = Prefix + "/GetByIsMostPurchased/{isMostPurchased}";
        public const string GetByIsMostWatched = Prefix + "/GetByIsMostWatched/{isMostWatched}";
        public const string GetByIsMostListened = Prefix + "/GetByIsMostListened/{isMostListened}";
        public const string GetByIsMostRead = Prefix + "/GetByIsMostRead/{isMostRead}";
        public const string GetByIsMostPlayed = Prefix + "/GetByIsMostPlayed/{isMostPlayed}";
        public const string GetByIsMostCompleted = Prefix + "/GetByIsMostCompleted/{isMostCompleted}";
        public const string GetByIsMostFailed = Prefix + "/GetByIsMostFailed/{isMostFailed}";
        public const string GetByIsMostAbandoned = Prefix + "/GetByIsMostAbandoned/{isMostAbandoned}";
        public const string GetByIsMostRevisited = Prefix + "/GetByIsMostRevisited/{isMostRevisited}";
        public const string GetByIsMostRecommended = Prefix + "/GetByIsMostRecommended/{isMostRecommended}";
        public const string GetByIsMostReported = Prefix + "/GetByIsMostReported/{isMostReported}";
        public const string GetByIsMostFlagged = Prefix + "/GetByIsMostFlagged/{isMostFlagged}";
        public const string GetByIsMostBlocked = Prefix + "/GetByIsMostBlocked/{isMostBlocked}";
        public const string GetByIsMostHidden = Prefix + "/GetByIsMostHidden/{isMostHidden}";
        public const string GetByIsMostArchived = Prefix + "/GetByIsMostArchived/{isMostArchived}";
    }

    public static class CategoryRouting
    {
        public const string Prefix = Rule + "Category";
        public const string Create = Prefix + "/Create";
        public const string Update = Prefix + "/Update";
        public const string Delete = Prefix + "/Delete/{id}";
        public const string GetById = Prefix + SingleId;
        public const string GetAll = Prefix + "/GetAll";
        public const string GetByName = Prefix + "/GetByName/{name}";
        public const string GetByDescription = Prefix + "/GetByDescription/{description}";
        public const string GetByParentId = Prefix + "/GetByParentId/{parentId}";
        public const string GetByIsActive = Prefix + "/GetByIsActive/{isActive}";
        public const string GetByIsDeleted = Prefix + "/GetByIsDeleted/{isDeleted}";
        public const string GetByIsFeatured = Prefix + "/GetByIsFeatured/{isFeatured}";
        public const string GetByIsPopular = Prefix + "/GetByIsPopular/{isPopular}";
        public const string GetByIsNew = Prefix + "/GetByIsNew/{isNew}";
        public const string GetByIsRecommended = Prefix + "/GetByIsRecommended/{isRecommended}";
        public const string GetByIsTrending = Prefix + "/GetByIsTrending/{isTrending}";
        public const string GetByIsBestSeller = Prefix + "/GetByIsBestSeller/{isBestSeller}";
        public const string GetByIsTopRated = Prefix + "/GetByIsTopRated/{isTopRated}";
        public const string GetByIsMostViewed = Prefix + "/GetByIsMostViewed/{isMostViewed}";
        public const string GetByIsMostEnrolled = Prefix + "/GetByIsMostEnrolled/{isMostEnrolled}";
        public const string GetByIsMostReviewed = Prefix + "/GetByIsMostReviewed/{isMostReviewed}";
        public const string GetByIsMostRated = Prefix + "/GetByIsMostRated/{isMostRated}";
        public const string GetByIsMostCommented = Prefix + "/GetByIsMostCommented/{isMostCommented}";
        public const string GetByIsMostLiked = Prefix + "/GetByIsMostLiked/{isMostLiked}";
        public const string GetByIsMostShared = Prefix + "/GetByIsMostShared/{isMostShared}";
        public const string GetByIsMostBookmarked = Prefix + "/GetByIsMostBookmarked/{isMostBookmarked}";
        public const string GetByIsMostDownloaded = Prefix + "/GetByIsMostDownloaded/{isMostDownloaded}";
        public const string GetByIsMostPurchased = Prefix + "/GetByIsMostPurchased/{isMostPurchased}";
        public const string GetByIsMostWatched = Prefix + "/GetByIsMostWatched/{isMostWatched}";
        public const string GetByIsMostListened = Prefix + "/GetByIsMostListened/{isMostListened}";
        public const string GetByIsMostRead = Prefix + "/GetByIsMostRead/{isMostRead}";
        public const string GetByIsMostPlayed = Prefix + "/GetByIsMostPlayed/{isMostPlayed}";
        public const string GetByIsMostCompleted = Prefix + "/GetByIsMostCompleted/{isMostCompleted}";
        public const string GetByIsMostFailed = Prefix + "/GetByIsMostFailed/{isMostFailed}";
        public const string GetByIsMostAbandoned = Prefix + "/GetByIsMostAbandoned/{isMostAbandoned}";
        public const string GetByIsMostRevisited = Prefix + "/GetByIsMostRevisited/{isMostRevisited}";
        public const string GetByIsMostRecommended = Prefix + "/GetByIsMostRecommended/{isMostRecommended}";
        public const string GetByIsMostReported = Prefix + "/GetByIsMostReported/{isMostReported}";
        public const string GetByIsMostFlagged = Prefix + "/GetByIsMostFlagged/{isMostFlagged}";
        public const string GetByIsMostBlocked = Prefix + "/GetByIsMostBlocked/{isMostBlocked}";
        public const string GetByIsMostHidden = Prefix + "/GetByIsMostHidden/{isMostHidden}";
        public const string GetByIsMostArchived = Prefix + "/GetByIsMostArchived/{isMostArchived}";
    }

    public static class TeacherRouting
    {
        public const string Prefix = Rule + "Teacher";
        public const string Create = Prefix + "/Create";
        public const string Update = Prefix + "/Update";
        public const string Delete = Prefix + "/Delete/{id}";
        public const string GetById = Prefix + SingleId;
        public const string GetAll = Prefix + "/GetAll";
        public const string GetByName = Prefix + "/GetByName/{name}";
        public const string GetByEmail = Prefix + "/GetByEmail/{email}";
        public const string GetByPhone = Prefix + "/GetByPhone/{phone}";
        public const string GetBySpecialization = Prefix + "/GetBySpecialization/{specialization}";
        public const string GetByExperienceRange = Prefix + "/GetByExperienceRange";
        public const string GetByDateRange = Prefix + "/GetByDateRange";
        public const string GetByIsActive = Prefix + "/GetByIsActive/{isActive}";
        public const string GetByIsDeleted = Prefix + "/GetByIsDeleted/{isDeleted}";
        public const string GetByIsVerified = Prefix + "/GetByIsVerified/{isVerified}";
        public const string GetByIsFeatured = Prefix + "/GetByIsFeatured/{isFeatured}";
        public const string GetByIsPopular = Prefix + "/GetByIsPopular/{isPopular}";
        public const string GetByIsNew = Prefix + "/GetByIsNew/{isNew}";
        public const string GetByIsRecommended = Prefix + "/GetByIsRecommended/{isRecommended}";
        public const string GetByIsTrending = Prefix + "/GetByIsTrending/{isTrending}";
        public const string GetByIsBestSeller = Prefix + "/GetByIsBestSeller/{isBestSeller}";
        public const string GetByIsTopRated = Prefix + "/GetByIsTopRated/{isTopRated}";
        public const string GetByIsMostViewed = Prefix + "/GetByIsMostViewed/{isMostViewed}";
        public const string GetByIsMostEnrolled = Prefix + "/GetByIsMostEnrolled/{isMostEnrolled}";
        public const string GetByIsMostReviewed = Prefix + "/GetByIsMostReviewed/{isMostReviewed}";
        public const string GetByIsMostRated = Prefix + "/GetByIsMostRated/{isMostRated}";
        public const string GetByIsMostCommented = Prefix + "/GetByIsMostCommented/{isMostCommented}";
        public const string GetByIsMostLiked = Prefix + "/GetByIsMostLiked/{isMostLiked}";
        public const string GetByIsMostShared = Prefix + "/GetByIsMostShared/{isMostShared}";
        public const string GetByIsMostBookmarked = Prefix + "/GetByIsMostBookmarked/{isMostBookmarked}";
        public const string GetByIsMostDownloaded = Prefix + "/GetByIsMostDownloaded/{isMostDownloaded}";
        public const string GetByIsMostPurchased = Prefix + "/GetByIsMostPurchased/{isMostPurchased}";
        public const string GetByIsMostWatched = Prefix + "/GetByIsMostWatched/{isMostWatched}";
        public const string GetByIsMostListened = Prefix + "/GetByIsMostListened/{isMostListened}";
        public const string GetByIsMostRead = Prefix + "/GetByIsMostRead/{isMostRead}";
        public const string GetByIsMostPlayed = Prefix + "/GetByIsMostPlayed/{isMostPlayed}";
        public const string GetByIsMostCompleted = Prefix + "/GetByIsMostCompleted/{isMostCompleted}";
        public const string GetByIsMostFailed = Prefix + "/GetByIsMostFailed/{isMostFailed}";
        public const string GetByIsMostAbandoned = Prefix + "/GetByIsMostAbandoned/{isMostAbandoned}";
        public const string GetByIsMostRevisited = Prefix + "/GetByIsMostRevisited/{isMostRevisited}";
        public const string GetByIsMostRecommended = Prefix + "/GetByIsMostRecommended/{isMostRecommended}";
        public const string GetByIsMostReported = Prefix + "/GetByIsMostReported/{isMostReported}";
        public const string GetByIsMostFlagged = Prefix + "/GetByIsMostFlagged/{isMostFlagged}";
        public const string GetByIsMostBlocked = Prefix + "/GetByIsMostBlocked/{isMostBlocked}";
        public const string GetByIsMostHidden = Prefix + "/GetByIsMostHidden/{isMostHidden}";
        public const string GetByIsMostArchived = Prefix + "/GetByIsMostArchived/{isMostArchived}";
    }

    public static class NotificationRouting
    {
        public const string Prefix = Rule + "Notification";
        public const string Create = Prefix + "/Create";
        public const string Update = Prefix + "/Update";
        public const string Delete = Prefix + "/Delete/{id}";
        public const string GetById = Prefix + SingleId;
        public const string GetAll = Prefix + "/GetAll";
        public const string GetByUserId = Prefix + "/GetByUserId/{userId}";
        public const string GetByType = Prefix + "/GetByType/{type}";
        public const string GetByStatus = Prefix + "/GetByStatus/{status}";
        public const string GetByDateRange = Prefix + "/GetByDateRange";
        public const string GetUnread = Prefix + "/GetUnread";
        public const string MarkAsRead = Prefix + "/MarkAsRead/{id}";
        public const string MarkAllAsRead = Prefix + "/MarkAllAsRead";
        public const string GetByIsRead = Prefix + "/GetByIsRead/{isRead}";
        public const string GetByIsDeleted = Prefix + "/GetByIsDeleted/{isDeleted}";
        public const string GetByIsActive = Prefix + "/GetByIsActive/{isActive}";
    }

    public static class FileRouting
    {
        public const string Prefix = Rule + "File";
        public const string Upload = Prefix + "/Upload";
        public const string Download = Prefix + "/Download/{id}";
        public const string Delete = Prefix + "/Delete/{id}";
        public const string GetById = Prefix + SingleId;
        public const string GetAll = Prefix + "/GetAll";
        public const string GetByUserId = Prefix + "/GetByUserId/{userId}";
        public const string GetByType = Prefix + "/GetByType/{type}";
        public const string GetByDateRange = Prefix + "/GetByDateRange";
        public const string GetBySizeRange = Prefix + "/GetBySizeRange";
        public const string GetByIsDeleted = Prefix + "/GetByIsDeleted/{isDeleted}";
        public const string GetByIsActive = Prefix + "/GetByIsActive/{isActive}";
    }

    public static class ReviewRouting
    {
        public const string Prefix = Rule + "Review";
        public const string Create = Prefix + "/Create";
        public const string Update = Prefix + "/Update";
        public const string Delete = Prefix + "/Delete/{id}";
        public const string GetById = Prefix + SingleId;
        public const string GetAll = Prefix + "/GetAll";
        public const string GetByUserId = Prefix + "/GetByUserId/{userId}";
        public const string GetByCourseId = Prefix + "/GetByCourseId/{courseId}";
        public const string GetByRating = Prefix + "/GetByRating/{rating}";
        public const string GetByDateRange = Prefix + "/GetByDateRange";
        public const string GetByIsDeleted = Prefix + "/GetByIsDeleted/{isDeleted}";
        public const string GetByIsActive = Prefix + "/GetByIsActive/{isActive}";
        public const string GetByIsVerified = Prefix + "/GetByIsVerified/{isVerified}";
    }

    public static class ProgressRouting
    {
        public const string Prefix = Rule + "Progress";
        public const string Create = Prefix + "/Create";
        public const string Update = Prefix + "/Update";
        public const string Delete = Prefix + "/Delete/{id}";
        public const string GetById = Prefix + SingleId;
        public const string GetAll = Prefix + "/GetAll";
        public const string GetByUserId = Prefix + "/GetByUserId/{userId}";
        public const string GetByCourseId = Prefix + "/GetByCourseId/{courseId}";
        public const string GetByLessonId = Prefix + "/GetByLessonId/{lessonId}";
        public const string GetByStatus = Prefix + "/GetByStatus/{status}";
        public const string GetByDateRange = Prefix + "/GetByDateRange";
        public const string GetByCompletionPercentage = Prefix + "/GetByCompletionPercentage/{percentage}";
        public const string GetByIsCompleted = Prefix + "/GetByIsCompleted/{isCompleted}";
        public const string GetByIsDeleted = Prefix + "/GetByIsDeleted/{isDeleted}";
        public const string GetByIsActive = Prefix + "/GetByIsActive/{isActive}";
    }

    public static class CertificateRouting
    {
        public const string Prefix = Rule + "Certificate";
        public const string Create = Prefix + "/Create";
        public const string Update = Prefix + "/Update";
        public const string Delete = Prefix + "/Delete/{id}";
        public const string GetById = Prefix + SingleId;
        public const string GetAll = Prefix + "/GetAll";
        public const string GetByUserId = Prefix + "/GetByUserId/{userId}";
        public const string GetByCourseId = Prefix + "/GetByCourseId/{courseId}";
        public const string GetByDateRange = Prefix + "/GetByDateRange";
        public const string GetByIsVerified = Prefix + "/GetByIsVerified/{isVerified}";
        public const string GetByIsDeleted = Prefix + "/GetByIsDeleted/{isDeleted}";
        public const string GetByIsActive = Prefix + "/GetByIsActive/{isActive}";
        public const string Verify = Prefix + "/Verify/{id}";
        public const string Download = Prefix + "/Download/{id}";
    }

    public static class QuizRouting
    {
        public const string Prefix = Rule + "Quiz";
        public const string Create = Prefix + "/Create";
        public const string Update = Prefix + "/Update";
        public const string Delete = Prefix + "/Delete/{id}";
        public const string GetById = Prefix + SingleId;
        public const string GetAll = Prefix + "/GetAll";
        public const string GetByCourseId = Prefix + "/GetByCourseId/{courseId}";
        public const string GetByLessonId = Prefix + "/GetByLessonId/{lessonId}";
        public const string GetByDateRange = Prefix + "/GetByDateRange";
        public const string GetByIsPublished = Prefix + "/GetByIsPublished/{isPublished}";
        public const string GetByIsDeleted = Prefix + "/GetByIsDeleted/{isDeleted}";
        public const string GetByIsActive = Prefix + "/GetByIsActive/{isActive}";
        public const string SubmitAnswer = Prefix + "/SubmitAnswer";
        public const string GetResults = Prefix + "/GetResults/{quizId}";
        public const string GetUserResults = Prefix + "/GetUserResults/{userId}";
    }

    public static class QuestionRouting
    {
        public const string Prefix = Rule + "Question";
        public const string Create = Prefix + "/Create";
        public const string Update = Prefix + "/Update";
        public const string Delete = Prefix + "/Delete/{id}";
        public const string GetById = Prefix + SingleId;
        public const string GetAll = Prefix + "/GetAll";
        public const string GetByQuizId = Prefix + "/GetByQuizId/{quizId}";
        public const string GetByType = Prefix + "/GetByType/{type}";
        public const string GetByDifficulty = Prefix + "/GetByDifficulty/{difficulty}";
        public const string GetByIsDeleted = Prefix + "/GetByIsDeleted/{isDeleted}";
        public const string GetByIsActive = Prefix + "/GetByIsActive/{isActive}";
    }

    public static class AnswerRouting
    {
        public const string Prefix = Rule + "Answer";
        public const string Create = Prefix + "/Create";
        public const string Update = Prefix + "/Update";
        public const string Delete = Prefix + "/Delete/{id}";
        public const string GetById = Prefix + SingleId;
        public const string GetAll = Prefix + "/GetAll";
        public const string GetByQuestionId = Prefix + "/GetByQuestionId/{questionId}";
        public const string GetByUserId = Prefix + "/GetByUserId/{userId}";
        public const string GetByIsCorrect = Prefix + "/GetByIsCorrect/{isCorrect}";
        public const string GetByIsDeleted = Prefix + "/GetByIsDeleted/{isDeleted}";
        public const string GetByIsActive = Prefix + "/GetByIsActive/{isActive}";
    }

    public static class UserProgressRouting
    {
        public const string Prefix = Rule + "UserProgress";
        public const string Create = Prefix + "/Create";
        public const string Update = Prefix + "/Update";
        public const string Delete = Prefix + "/Delete/{id}";
        public const string GetById = Prefix + SingleId;
        public const string GetAll = Prefix + "/GetAll";
        public const string GetByUserId = Prefix + "/GetByUserId/{userId}";
        public const string GetByCourseId = Prefix + "/GetByCourseId/{courseId}";
        public const string GetByLessonId = Prefix + "/GetByLessonId/{lessonId}";
        public const string GetByStatus = Prefix + "/GetByStatus/{status}";
        public const string GetByDateRange = Prefix + "/GetByDateRange";
        public const string GetByCompletionPercentage = Prefix + "/GetByCompletionPercentage/{percentage}";
        public const string GetByIsCompleted = Prefix + "/GetByIsCompleted/{isCompleted}";
        public const string GetByIsDeleted = Prefix + "/GetByIsDeleted/{isDeleted}";
        public const string GetByIsActive = Prefix + "/GetByIsActive/{isActive}";
    }

    public static class UserActivityRouting
    {
        public const string Prefix = Rule + "UserActivity";
        public const string Create = Prefix + "/Create";
        public const string Update = Prefix + "/Update";
        public const string Delete = Prefix + "/Delete/{id}";
        public const string GetById = Prefix + SingleId;
        public const string GetAll = Prefix + "/GetAll";
        public const string GetByUserId = Prefix + "/GetByUserId/{userId}";
        public const string GetByType = Prefix + "/GetByType/{type}";
        public const string GetByDateRange = Prefix + "/GetByDateRange";
        public const string GetByIsDeleted = Prefix + "/GetByIsDeleted/{isDeleted}";
        public const string GetByIsActive = Prefix + "/GetByIsActive/{isActive}";
    }

    public static class UserSettingsRouting
    {
        public const string Prefix = Rule + "UserSettings";
        public const string Create = Prefix + "/Create";
        public const string Update = Prefix + "/Update";
        public const string Delete = Prefix + "/Delete/{id}";
        public const string GetById = Prefix + SingleId;
        public const string GetAll = Prefix + "/GetAll";
        public const string GetByUserId = Prefix + "/GetByUserId/{userId}";
        public const string GetByType = Prefix + "/GetByType/{type}";
        public const string GetByIsDeleted = Prefix + "/GetByIsDeleted/{isDeleted}";
        public const string GetByIsActive = Prefix + "/GetByIsActive/{isActive}";
    }
}