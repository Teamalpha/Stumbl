# Generated by Django 2.1.5 on 2019-01-17 18:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0008_auto_20190117_1609'),
    ]

    operations = [
        migrations.AddField(
            model_name='playlist',
            name='default',
            field=models.BooleanField(default=False),
        ),
    ]
