package wol

import "testing"

func TestWakeOnLan(t *testing.T) {
	type args struct {
		macAddress string
		ipAddress  string
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{
			name: "Invalid ip addres",
			args: args{
				macAddress: "c6:d2:fe:1a:ed:8a",
				ipAddress:  "999.999.999.999",
			},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := WakeOnLan(tt.args.macAddress, tt.args.ipAddress); (err != nil) != tt.wantErr {
				t.Errorf("WakeOnLan() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
