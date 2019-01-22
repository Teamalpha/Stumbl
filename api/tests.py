from test_plus.test import TestCase as TestCasePlus

# Create your tests here.
class CoreTest(TestCasePlus):
    def test_index(self):
        a = self.client.get('/')
        self.assertEqual(a.status_code, 200)

    def test_no_logic_page(self):
        b = self.client.get('/about/')
        self.assertEqual(b.status_code, 200)
