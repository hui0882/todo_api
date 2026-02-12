package response

// ErrorCoder 错误码接口
type ErrorCoder interface {
	Code() int
	Message() string
	Error() string
}

// CommonError 通用错误结构
type CommonError struct {
	code    int
	message string
}

func (e CommonError) Error() string {
	return e.message
}

func (e CommonError) Code() int       { return e.code }
func (e CommonError) Message() string { return e.message }

// 业务错误码定义
var (
	// 成功
	ServerSuccess = CommonError{200, "success"}

	// 客户端错误 4xx
	BadRequest       = CommonError{400, "请求参数错误"}
	Unauthorized     = CommonError{401, "未登录或登录已过期"}
	Forbidden        = CommonError{403, "没有权限访问"}
	NotFound         = CommonError{404, "资源不存在"}
	AuthorExistError = CommonError{409, "用户名已存在"}

	// 服务器错误 5xx
	ServerError   = CommonError{500, "服务器内部错误"}
	DatabaseError = CommonError{501, "数据库操作失败"}
	RedisError    = CommonError{502, "缓存服务异常"}
	SessionError  = CommonError{503, "会话服务异常"}
	PasswordError = CommonError{510, "密码错误"}
	InvalidParams = CommonError{400, "参数验证失败"}
)
