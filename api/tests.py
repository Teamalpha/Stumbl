from test_plus.test import TestCase as TestCasePlus
from core.models import Post, User, Response, Follow

# Create your tests here.
class CoreTest(TestCasePlus):
    def test_index(self):
        a = self.client.get('/')
        self.assertEqual(a.status_code, 200)

    def test_no_logic_page(self):
        b = self.client.get('/about/')
        self.assertEqual(b.status_code, 200)

# class PostTest(TestCasePlus):

#     def test_post_creation(self):
#         self.user = User.objects.create_user('username_5', 'email_5@gmail.com', 'password')
#         self.post_data = {
#                 'text': 'cowabunga',
#                 'user': self.user
#             }
#         self.url = '/api/posts/'
#         response = self.post(self.url, data=self.post_data)
#         self.response_403(response)

#         # e = self.create_post()
#         # self.assertTrue(isinstance(e, Post))
#         # self.assertEqual(e.__str__(), e.text)

#     def tearDown(self):
#         self.user.delete()
