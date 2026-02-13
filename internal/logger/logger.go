package logger

import (
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"gopkg.in/natefinch/lumberjack.v2"
)

var Logger *log.Logger

func InitLogger() {
	logDir := "logs"

	if err := os.MkdirAll(logDir, 0755); err != nil {
		panic(fmt.Errorf("无法创建日志目录：%v", err))
	}

	logFileName := generateLogFileName(logDir)

	logPath := filepath.Join(logDir, logFileName)

	logWriter := &lumberjack.Logger{
		Filename:   logPath,
		MaxSize:    100,
		MaxBackups: 3,
		MaxAge:     7,
		Compress:   true,
	}
	multiWriter := io.MultiWriter(logWriter, os.Stdout)
	Logger = log.New(multiWriter, "", log.LstdFlags)
	Logger.Println("日志系统初始化成功，日志文件：", logFileName)
}

func generateLogFileName(logDir string) string {
	dataStr := time.Now().Format("2006-01-02")
	pattern := filepath.Join(logDir, dataStr+"*")
	files, _ := filepath.Glob(pattern)

	maxSeq := 0
	for _, file := range files {
		filename := filepath.Base(file)
		name := strings.TrimSuffix(filename, ".log")
		parts := strings.Split(name, "_")
		if len(parts) == 2 && strings.HasPrefix(filename, dataStr) {
			seq, err := strconv.Atoi(parts[1])
			if err == nil && seq > maxSeq {
				maxSeq = seq
			}
		}
	}
	nextSeq := maxSeq + 1
	seqStr := fmt.Sprintf("%02d", nextSeq)

	return fmt.Sprintf("%s_%s.log", dataStr, seqStr)
}
