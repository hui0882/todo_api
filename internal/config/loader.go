package config

import (
	"log"

	"github.com/spf13/viper"
)

var Cfg *Config

func LoadConfig() {
	viper.AddConfigPath(".")
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")

	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("读取配置文件失败：%v", err)
	}

	if err := viper.Unmarshal(&Cfg); err != nil {
		log.Fatalf("解析配置文件失败：%v", err)
	}
}
