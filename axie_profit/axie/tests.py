from django.test import TestCase
from .models import Axie

class AxieModelTest(TestCase):
    def test_create_axie(self):
        axie_name = "Mini"
        axie_id = 12345
        axie_level = 3

        axie = Axie.objects.create(
            name=axie_name,
            axie_id=axie_id,
            level=axie_level
        )

        self.assertEqual(axie.name, axie_name)
        self.assertEqual(axie.axie_id, axie_id)
        self.assertEqual(axie.level, axie_level)

