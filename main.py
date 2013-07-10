#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import webapp2
import os
from google.appengine.api import users
from google.appengine.api import mail
from google.appengine.ext.webapp import template

class MainHandler(webapp2.RequestHandler):
	def get(self):
		user = users.get_current_user()
		showGmail = False
		loginLink = ""
		if user is None:
			loginLink = users.create_login_url('/')
			showGmail = True
		template_values = {'showGmail': showGmail, 'loginLink': loginLink}
		path = os.path.join(os.path.dirname(__file__), 'index.html')
		self.response.out.write(template.render(path, template_values))

class TestEmailHandler(webapp2.RequestHandler):
	def get(self):
		template_values = {}
		path = os.path.join(os.path.dirname(__file__), 'testEmail.html')
		self.response.out.write(template.render(path, template_values))

class SendHandler(webapp2.RequestHandler):
	def post(self):
		user = users.get_current_user()
		sendees = self.request.get("sendees")
		sender = user.nickname() + "<" + user.email() + ">"
		subject = self.request.get("subject")
		message = self.request.get("message")
		activityStr = ""
		if (sendees[-1] == ','):
			sendees = sendees[0:-1]
		if ( sendees.find(",") != -1 ):
			sendees = sendees.split(",")
		else:
			sendees = [sendees]

		for sendee in sendees:
			activityStr += sendee + ", "
			email = mail.EmailMessage(sender=sender, subject=subject, to=sendee, body=message)
			email.send()
		self.response.out.write(activityStr)


class TestFbEventHandler(webapp2.RequestHandler):
	def get(self):
		template_values = {}
		path = os.path.join(os.path.dirname(__file__), 'testFbEvent.html')
		self.response.out.write(template.render(path, template_values))

class LegalHandler(webapp2.RequestHandler):
    def get(self):
        template_values = {}
		path = os.path.join(os.path.dirname(__file__), 'legal.html')
        self.response.out.write(template.render(path, template_values))

app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/testEmail', TestEmailHandler),
    ('/send', SendHandler),
    ('/testFbEvent', TestFbEventHandler),
    ('/legal', LegalHandler),
], debug=True)
