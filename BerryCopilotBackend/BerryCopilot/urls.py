# myapp/urls.py
from django.urls import path
from . import views
from .views import AuthenticationView,BerryCertGetData,BerryCertPostData,ClassVault

urlpatterns = [
    path('v2/vault_login/', AuthenticationView().vault_login, name='vault_login'),
    path('v2/login/', AuthenticationView().perform_login, name='login'),
    
    path('v2/fetch_folders_list/', ClassVault().fetch_folders_list, name='fetch_folders_list'),
    path('v2/get_default/', ClassVault().fetch_secrets, name='get_default'),

    path('v2/create_server/', BerryCertPostData().create_server, name='create_server'),
    path('v2/sync_pki/', BerryCertPostData().sync_pki, name='sync_pki'),
    path('v2/create_pki/', BerryCertPostData().create_pki, name='create_pki'),
    path('v2/create_credentials/', BerryCertPostData().create_credentials, name='create_credentials'),
    path('v2/create_usage/', BerryCertPostData().create_usage, name='create_usage'),
    path('v2/create_scan/', BerryCertPostData().create_scan, name='create_scan'), 

    path('v2/get_credentials_list/', BerryCertGetData().get_credentials_list, name='get_credentials_list'),
    path('v2/get_servers_list/', BerryCertGetData().get_servers_list, name='get_servers_list'),
    path('v2/get_usages_list/', BerryCertGetData().get_usages_list, name='get_usages_list'),  
    path('v2/get_pkis_list/', BerryCertGetData().get_pkis_list, name='get_pkis_list'),
    path('v2/get_certificate_authorities/', BerryCertGetData().get_certificate_authorities, name='get_certificate_authorities'),
    path('v2/get_certificate_profiles/',BerryCertGetData().get_certificate_profiles,name="get_certificate_profiles"),
    path('v2/get_types/',BerryCertGetData().get_types,name="get_types"),
    path('v2/get_end_entity_profiles/',BerryCertGetData().get_end_entity_profiles,name="get_end_entity_profiles"),
]
