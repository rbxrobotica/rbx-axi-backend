from django.db import models

class Config(models.Model):
    qtd_mementos = models.IntegerField()
    valores_para_ascender = models.IntegerField()

    class Meta:
        verbose_name = "Configuração"
        verbose_name_plural = "Configurações"

    @classmethod
    def get_solo(cls):
        # Retorna a única instância ou cria uma nova se não existir
        obj, created = cls.objects.get_or_create(pk=1)
        return obj