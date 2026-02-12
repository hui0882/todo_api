.PHONY: help run build test clean fmt lint dev

# 默认目标
help:
	@echo "可用命令:"
	@echo "  make run        - 运行服务"
	@echo "  make build      - 编译项目"
	@echo "  make test       - 运行测试"
	@echo "  make clean      - 清理编译文件"
	@echo "  make fmt        - 格式化代码"
	@echo "  make lint       - 代码检查"
	@echo "  make dev        - 开发模式运行（热重载）"

# 运行服务
run:
	@echo "启动服务..."
	@go run main.go

# 编译项目
build:
	@echo "编译项目..."
	@go build -o bin/todo-api main.go
	@echo "编译完成: bin/todo-api"

# 运行测试
test:
	@echo "运行测试..."
	@go test -v ./...

# 清理编译文件
clean:
	@echo "清理编译文件..."
	@rm -rf bin/
	@rm -rf logs/*.log
	@echo "清理完成"

# 格式化代码
fmt:
	@echo "格式化代码..."
	@go fmt ./...
	@echo "格式化完成"

# 代码检查
lint:
	@echo "代码检查..."
	@golangci-lint run ./...

# 开发模式（需要安装 air: go install github.com/cosmtrek/air@latest）
dev:
	@echo "开发模式启动（热重载）..."
	@air

# 下载依赖
deps:
	@echo "下载依赖..."
	@go mod download
	@go mod tidy
	@echo "依赖下载完成"

# 生成 swagger 文档（需要安装 swag: go install github.com/swaggo/swag/cmd/swag@latest）
swagger:
	@echo "生成 Swagger 文档..."
	@swag init
	@echo "Swagger 文档生成完成"
