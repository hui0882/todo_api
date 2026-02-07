package config

type Database struct {
	Host      string
	Port      string
	Username  string
	Password  string
	Dbname    string
	Charset   string
	ParseTime bool
}

type Redis struct {
	Host     string
	Port     string
	Password string
}

type Config struct {
	Server struct {
		Port string
	}
	Database Database
	Redis    Redis
}
