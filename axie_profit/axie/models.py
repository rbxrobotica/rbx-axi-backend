from django.db import models

class Axie(models.Model):
    name = models.CharField(max_length=100)
    axie_id = models.IntegerField()
    level = models.IntegerField()
    # Adicione outros campos relevantes (e.g., classe, partes do corpo)
    # ...

    def __str__(self):
        return self.name