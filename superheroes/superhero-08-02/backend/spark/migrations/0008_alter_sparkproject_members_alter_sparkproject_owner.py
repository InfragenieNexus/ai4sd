# Generated by Django 5.1.3 on 2024-11-21 14:50

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spark', '0007_alter_sparkproject_github_project_link_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sparkproject',
            name='members',
            field=models.ManyToManyField(blank=True, related_name='member_projects', to='spark.profile'),
        ),
        migrations.AlterField(
            model_name='sparkproject',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='owned_projects', to='spark.profile'),
        ),
    ]
