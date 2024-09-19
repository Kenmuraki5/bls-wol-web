package models

import (
	"time"
)

type ScheduleWOL struct {
	ID             int
	MacAddress     string
	IpAddress      string
	NetworkAddress string
	Port           uint32
	WakeTime       time.Time
}
