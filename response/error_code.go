package response

// ErrorCoder 错误码接口
type ErrorCoder interface {
	Code() int
	Message() string
}

// 预定义常用错误码
type CommonError struct {
	code    int
	message string
}

func (e CommonError) Error() string {
	return e.message
}

func (e CommonError) Code() int       { return e.code }
func (e CommonError) Message() string { return e.message }

var (
	ServerSuccess    = CommonError{200, "success"}
	ServerError      = CommonError{500, "服务器开小差了"}
	InvalidParams    = CommonError{400, "参数错误"}
	Unauthorized     = CommonError{401, "账号或密码错误"}
	AuthorExistError = CommonError{402, "账号已存在"}
	NotFound         = CommonError{404, "资源不存在"}
)
