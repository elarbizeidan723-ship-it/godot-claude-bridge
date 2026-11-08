extends Node

# استبدل هذا بالرابط الذي حصلت عليه من موقع Render
const SERVER_URL = "https://onrender.com"

@onready var http_request = $HTTPRequest

func _ready():
	# ربط إشارة اكتمال الطلب بالدالة المسؤولة عن معالجة النتيجة
	http_request.request_completed.connect(_on_request_completed)
	
	# تجربة إرسال سؤال لكلاود عند تشغيل اللعبة
	ask_claude("مرحباً كلاود، أنا أكلمك من داخل لعبة Godot على هاتفي!")

func ask_claude(prompt_text: String):
	var headers = ["Content-Type: application/json"]
	var body = JSON.stringify({"prompt": prompt_text})
	
	# إرسال الطلب للخادم الأونلاين
	var error = http_request.request(SERVER_URL, headers, HTTPClient.METHOD_POST, body)
	if error != OK:
		print("فشل في إرسال الطلب: ", error)

func _on_request_completed(result, response_code, headers, body):
	if response_code == 200:
		var json = JSON.parse_string(body.get_string_from_utf8())
		if json and json.has("reply"):
			print("رد كلاود: ", json["reply"])
		else:
			print("استجابة غير صالحة من الخادم")
	else:
		print("خطأ من السيرفر، رمز الاستجابة: ", response_code)
