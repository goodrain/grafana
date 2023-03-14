package util

import "os"

var translationMetadata = map[string]string{
	"Learn about problems in your systems moments after they occur": "在系统出现问题后立即了解问题",
	"Alerting":          "报警",
	"Explore":           "探索",
	"Explore your data": "探索你的数据",
	"Alert rules":       "警报规则",
	"Rules that determine whether an alert will fire": "确定警报是否会触发的规则",
	"Contact points": "联络点",
	"Decide how your contacts are notified when an alert fires": "决定当警报触发时如何通知联系人",
	"Notification policies":                             "通知策略",
	"Determine how alerts are routed to contact points": "确定警报如何路由到联络点",
	"Silences": "静默",
	"Stop notifications from one or more alerting rules": "停止来自一个或多个警报规则的通知",
	"Alert groups": "警戒组",
	"See grouped alerts from an Alertmanager instance": "请参阅 Alertmanager 实例的分组警报",
	"Admin": "管理员",
}

// Translation -
func Translation(english string) string {
	if chinese, ok := translationMetadata[english]; ok {
		if os.Getenv("LANGUAGE") == "en" {
			return english
		}
		return chinese
	}
	return english
}
