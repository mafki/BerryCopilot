from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from bs4 import BeautifulSoup
from urllib.parse import urlparse, parse_qs
import json,requests
from django.views import View
import warnings
import time

warnings.filterwarnings("ignore", message="Unverified HTTPS request")




class ClassVault:
    @csrf_exempt
    def fetch_folders_list(self, request):
        client_token = request.POST.get('client_token')
        path = request.POST.get('path')
        if path[-1] != "/":
            url = f'https://vault.digitalberry.fr/v1/dev{path}'
        else:
            url = f'https://vault.digitalberry.fr/v1/dev{path}?list=true'
        
        headers = {
            'accept': '*/*',
            'X-Vault-Token': client_token
        }
        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                return JsonResponse(response.json())
            else:
                return JsonResponse({'error': 'Failed to fetch secrets from Vault', 'response': response.text,'path':url}, status=500)
        except requests.RequestException as e:
            return JsonResponse({'error': str(e)}, status=500) 

    @csrf_exempt
    def fetch_secrets(self, request):
        client_token = request.POST.get('client_token')
    
        url = 'https://vault.digitalberry.fr/v1/dev/internal_pkis%2F?list=true'
        headers = {
            'accept': '*/*',
            'X-Vault-Token': client_token
        }
        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                return JsonResponse(response.json())
            else:
                return JsonResponse({'error': 'Failed to fetch secrets from Vault', 'response': response.text}, status=500)
        except requests.RequestException as e:
            return JsonResponse({'error': str(e)}, status=500) 


class BerryCertPostData:
    @csrf_exempt
    def create_server(self, request):
        data = json.loads(request.body)
        client_token = data.get('client_token')
        payload = data.get('data')
        site= payload.get('site')
        url_1 = f'https://{site}.digitalberry.fr/bcs-berrycertcore/api/v1/hosts/?frontVersion=dev-version'
        payload = {
            "fqdn": payload.get('FQDN'),
            "credential_id": payload.get('cred-id'),
            "name": payload.get('server-name'),
            "protocol": payload.get('protocol').upper(),
            "deployment_path": payload.get('path'),
            "port": int(payload.get('port')),
            "persisted":False,
            "tenant": payload.get('tenant')
        }
        
        headers = {
            'Cookie': f'Token={client_token}; RefreshToken={client_token}',
        }
        try:
            response = requests.post(url_1, json=payload, headers=headers, verify=False)
            if response.status_code == 201:
                return JsonResponse(response.json())
            else:
                return JsonResponse({"err server":response.json()}, status=response.status_code)
        except requests.RequestException as e:
            return JsonResponse({'error': str(e)}, status=500)


    @csrf_exempt
    def sync_pki(self, request):
        time.sleep(15)
        data = json.loads(request.body)
        client_token = data.get('client_token')
        payload= data.get('data')
        site= payload.get('site')
        url = f'https://{site}.digitalberry.fr/bcs-berryscheduler/api/v1/tasks/?frontVersion=dev-version'
        headers = {
            'Cookie': f'Token={str(client_token)}',
            'Content-Type': 'application/json; charset=UTF-8'
        }
        sync_data = {
            "name": "SYNC_PKI",
            "retry_number": 0,
            "task_type": "SYNC_PKI",
            "args": {
                "pki_id": payload.get('pki-id'),
                "type_pki": payload.get('type'),
                "security_policy_id": 1,
                "synchronized_data": {
                    "certificates": {
                        "status": False,
                        "active": False,
                        "revoked": False,
                        "expired": False,
                        "assign_contact_email": False
                    },
                    "certificate_authorities": {
                        "status": True
                    },
                    "certificate_profiles": {
                        "status": True
                    }
                },
                "tenant": payload.get('tenant'),
                "limit": payload.get('numberOfCertificates'),
                "offset": payload.get('startsyncfrom')
            },
            "tenant": payload.get('tenant')
        }
        
        try:
            response = requests.post(url, json=sync_data, headers=headers,verify=False)
            if response.status_code == 201:
                return JsonResponse(response.json())
            else:
                return JsonResponse({'error': response.json()}, status=response.status_code)
        except requests.RequestException as e:
            return JsonResponse({'error 3000': str(e)}, status=500)

    @csrf_exempt
    def create_pki(self, request):
        data = json.loads(request.body)
        client_token = data.get('client_token')
        payload= data.get('data')
        site= payload.get('site')
        proxy = {
        'http': 'http://127.0.0.1:8080',  # Burp Suite default proxy address
        'https': 'http://127.0.0.1:8080'  # Burp Suite default proxy address
        }

        url_1 = f'https://{site}.digitalberry.fr/bcs-berrycertcore/api/v1/hosts/'
        url_2 = f'https://{site}.digitalberry.fr/bcs-berrycertcore/api/v1/pkis/'
        host_data = {
            "fqdn": payload.get('FQDN'),
            "credential_id": payload.get('cred-id'),
            "name": payload.get('pki-name'),
            "admin_managed": False,
            "protocol": payload.get('protocol'),
            "port": int(payload.get('port')),
            "tenant": payload.get('tenant')
        }
        
        headers = {
            'Cookie': f'Token={client_token}; RefreshToken={client_token}',
        }
        try:
            response = requests.post(url_1, json=host_data, headers=headers, verify=False)
            if response.status_code == 201:
                print("host created successfully:")
            else:
                return JsonResponse({"err host":response.json()}, status=response.status_code)
            if(payload.get('atype') == 'TLS_PLAIN_KEY'):
                pki_data = {
                "engine": payload.get('type'),
                "host": response.json()["id"],
                "tenant": payload.get('tenant'),
                "sync_all_certificates": False,
                "external_args": "{}",
                "name": payload.get('pki-name'),
                }
            else:     
                pki_data = {
                "engine": payload.get('type'),
                "host": response.json()["id"],
                "tenant": payload.get('tenant'),
                "sync_all_certificates": False,
                "external_args": "{\"limit\":10,\"offset\":0}",
                "name": payload.get('pki-name'),
                }
            response2 = requests.post(url_2, json=pki_data, headers=headers,verify=False)
            if response2.status_code == 201:
                return JsonResponse(response2.json())
            else:
                return JsonResponse({"err pki":response2.json()}, status=response2.status_code)
        except requests.RequestException as e:
            return JsonResponse({'error': str(e)}, status=500)

    @csrf_exempt
    def create_credentials(self, request):
        data = json.loads(request.body)
        client_token = data.get('client_token')
        payload = data.get('data')
        site= payload.get('site')
        proxy_url = 'http://localhost:8080'  # Change the port if necessary

        proxies = {
        'http': proxy_url,
        'https': proxy_url,
        }
        url = f'https://{site}.digitalberry.fr/bcs-berryexchange/api/v1/credentials/?frontVersion=dev-version'
        if(payload.get('atype') == 'TLS_PLAIN_KEY'):
            data = {
            "name": payload.get('cred-name'),
            "content": {
                "auth_type": payload.get("atype"),
                "b64_certificate": payload.get('crt'),
                "private_key": payload.get('key'),
                "verification_ssl":"false"
            },
            "protocol": payload.get("protocol").upper(),
            "tenant": payload.get('tenant'),
            }
        else:     
            data = {
            "name": payload.get('cred-name'),
            "content": {
                "auth_type": payload.get("atype"),
                "username": payload.get('login'),
                "password": payload.get('password')
            },
        "protocol": payload.get("protocol").upper(),
        "tenant": payload.get('tenant'),
        }
        headers = {
            'Content-Type': 'application/json',
            'Cookie': f'Token={str(client_token)}; RefreshToken={str(client_token)}',
        }
        try:
            response = requests.post(url, json=data, headers=headers, verify=False)
            if response.status_code == 201:
                print("credentials created successfully")
                return JsonResponse(response.json())
            else:
                return JsonResponse({'error': response.json()}, status=response.status_code )            
        except requests.RequestException as e:
            return JsonResponse({'error': str(e)}, status=500) 

    @csrf_exempt
    def create_usage(self, request):
        data = json.loads(request.body)
        client_token = data.get('client_token')
        payload = data.get('data')
        site= payload.get('site')
        url = f'https://{site}.digitalberry.fr/bcs-berrycertcore/api/v1/usages/?frontVersion=dev-version'
        print(payload.get('eep'))
        if(payload.get('eep')==""):
            eep=None
        else:
            eep=payload.get('eep')
        
        data = {
        "name":  payload.get('usage-name'),
        "certificate_authority": payload.get('ca'),
        "pki": payload.get('pki-id'),
        "profile": payload.get('cpr'),
        "security_policy": 1,
        "created_by": None,
        "created_at": None,
        "configurations": {
            "key_algo": {"optionnal": False, "value": payload.get('key_t')},
            "key_size": {"optionnal": False, "value": payload.get('key_s')},
            "common_name": {"value": "test", "update": True, "optionnal": True}
        },
        "external_args": "{\"rekey\":true}",
        "dns_challenge": {},
        "end_entity_profile": eep,
        "zone": None,
        "centralized_mode": True,
        payload.get('dcsr').lower(): True,
        "default_generation_mode": payload.get('dcsr'),
        "local_machine_store": None,
        "is_local_machine": False,
        "current_user_store": None,
        "is_current_user": False,
        "tenant": payload.get('tenant')
        }
        headers = {
            'Cookie': f'Token={client_token}; RefreshToken={client_token}',
        }
        try:
            response = requests.post(url, json=data, headers=headers, verify=False)
            if response.status_code == 201:
                return JsonResponse(response.json())
            else:
                print(response.json())
                return JsonResponse({'error': str(response.text)}, status=response.status_code)
        except requests.RequestException as e:
            return JsonResponse({'error': str(e)}, status=500)

    @csrf_exempt
    def create_scan(self, request):
        data = json.loads(request.body)
        client_token = data.get('client_token')
        payload = data.get('data')
        site= payload.get('site')
        url = f'https://{site}.digitalberry.fr/bcs-berryscheduler/api/v1/tasks/?frontVersion=dev-version'
        data = {
            "args": {
                "host_id": payload.get('server-id'),
                "cmd_post_deploy": payload.get('cpd'),
                "tags": [],
                "ports": "",
                "network": [],
                "fqdns": "",
                "path": payload.get('fsp'),
                "extensions": ["*.pem", "*.key", "*.crt", "*.cer", "*.p7b", "*.der", "*.jks", "*.p12", "*.pfx"]
            },
            "task_type": payload.get('type'),
            "retry_number": 3,
            "name": payload.get('scan-name'),
            "tenant": payload.get('tenant')
        }
        if(payload.get('servertype') != ''):
            data["args"]["apache_restart_command"] = payload.get('restartcommand')
            data["args"]["app_type"] = payload.get('servertype')
            data["args"]["configuration_path"] = payload.get('configpath')


        headers = {
            'Cookie': f'Token={client_token}; RefreshToken={client_token}',
        }
        try:
            response = requests.post(url, json=data, headers=headers, verify=False)
            if response.status_code == 201:
                return JsonResponse(response.json())
            else:
                return JsonResponse({'error': response.json()}, status=response.status_code)
        except requests.RequestException as e:
            return JsonResponse({'error': str(e)}, status=500)


class BerryCertGetData:
    @csrf_exempt
    def get_credentials_list(self, request):
        data = json.loads(request.body)
        client_token = data.get('client_token')
        payload = data.get('data')
        tenant=payload.get('tenant')
        site= payload.get('site')
        url = f'https://{site}.digitalberry.fr/bcs-berryexchange/api/v1/credentials/?page=1&size=20&sort=id,asc&tenant__in={tenant}&&frontVersion=dev-version'
        headers = {
            'Cookie': f'Token={client_token}; RefreshToken={client_token}',
        }
        try:
            response = requests.get(url, headers=headers, verify=False)
            if response.status_code == 200:
                return JsonResponse(response.json(),safe=False)
            else:
                return JsonResponse({'error': response.json()}, status=response.status_code)
        except requests.RequestException as e:
            return JsonResponse({'error': str(e)}, status=500)

    @csrf_exempt
    def get_servers_list(self, request):
        data = json.loads(request.body)
        client_token = data.get('client_token')
        payload = data.get('data')
        tenant=payload.get('tenant')
        site= payload.get('site')
        url = f'https://{site}.digitalberry.fr/bcs-berrycertcore/api/v1/hosts/?is_pki=false&page=1&size=20&sort=id,asc&uniq_in_progress=1&tenant__in={tenant}&&frontVersion=dev-version'
        headers = {
            'Cookie': f'Token={client_token}; RefreshToken={client_token}',
        }
        try:
            response = requests.get(url, headers=headers, verify=False)
            if response.status_code == 200:
                return JsonResponse(response.json(),safe=False)
            else:
                return JsonResponse({'error': response.json()}, status=response.status_code)
        except requests.RequestException as e:
            return JsonResponse({'error': str(e)}, status=500)

    @csrf_exempt
    def get_usages_list(self, request):
        data = json.loads(request.body)
        client_token = data.get('client_token')
        payload = data.get('data')
        tenant=payload.get('tenant')
        site= payload.get('site')
        url = f'https://{site}.digitalberry.fr/bcs-berrycertcore/api/v1/usages/?page=1&size=20&sort=id,asc&tenant__in={tenant}&&frontVersion=dev-version'
        headers = {
            'Cookie': f'Token={client_token}; RefreshToken={client_token}',
        }
        try:
            response = requests.get(url, headers=headers, verify=False)
            if response.status_code == 200:
                return JsonResponse(response.json(),safe=False)
            else:
                return JsonResponse({'error': response.json()}, status=response.status_code)
        except requests.RequestException as e:
            return JsonResponse({'error': str(e)}, status=500)


    @csrf_exempt
    def get_pkis_list(self, request):
        data = json.loads(request.body)
        client_token = data.get('client_token')
        payload = data.get('data')
        tenant=payload.get('tenant')
        site= payload.get('site')
        url = f'https://{site}.digitalberry.fr/bcs-berrycertcore/api/v1/pkis/?page=1&size=20&sort=id,asc&tenant__in={tenant}&&frontVersion=dev-version'
        headers = {
            'Cookie': f'Token={client_token}; RefreshToken={client_token}',
        }
        try:
            response = requests.get(url, headers=headers, verify=False)
            if response.status_code == 200:
                return JsonResponse(response.json(),safe=False)
            else:
                return JsonResponse({'error': response.json()}, status=response.status_code)
        except requests.RequestException as e:
            return JsonResponse({'error': str(e)}, status=500)

    @csrf_exempt
    def get_server_list(self, request):
        data = json.loads(request.body)
        client_token = data.get('client_token')
        payload = data.get('data')
        tenant=payload.get('tenant')
        site= payload.get('site')
        url = f'https://{site}.digitalberry.fr/bcs-berrycertcore/api/v1/hosts/?is_pki=false&page=1&size=20&sort=id,asc&uniq_in_progress=1&tenant__in={tenant}&&frontVersion=dev-version'
        headers = {
            'Cookie': f'Token={client_token}; RefreshToken={client_token}',
        }
        try:
            response = requests.get(url, headers=headers, verify=False)
            if response.status_code == 200:
                return JsonResponse(response.json(),safe=False)
            else:
                return JsonResponse({'error': response.json()}, status=response.status_code)
        except requests.RequestException as e:
            return JsonResponse({'error': str(e)}, status=500)
    @csrf_exempt
    def get_certificate_authorities(self, request):
        data = json.loads(request.body)
        client_token = data.get('client_token')
        payload = data.get('data')
        tenant=payload.get('tenant')
        site= payload.get('site')
        url = f'https://{site}.digitalberry.fr/bcs-berrycertcore/api/v1/certificate_authorities/?page=1&size=20&sort=id,asc&tenant__in={tenant}&pki=&&depth=2&frontVersion=dev-version'
        headers = {
            'Cookie': f'Token={client_token}; RefreshToken={client_token}',
        }
        try:
            response = requests.get(url, headers=headers, verify=False)
            if response.status_code == 200:
                return JsonResponse(response.json(),safe=False)
            else:
                return JsonResponse({'error': response.json()}, status=response.status_code)
        except requests.RequestException as e:
            return JsonResponse({'error': str(e)}, status=500)

    @csrf_exempt
    def get_certificate_profiles(self, request):
        data = json.loads(request.body)
        client_token = data.get('client_token')
        payload = data.get('data')
        tenant=payload.get('tenant')
        site= payload.get('site')
        url = f'https://{site}.digitalberry.fr/bcs-berrycertcore/api/v1/certificate_profiles/?tenant__in={tenant}&frontVersion=dev-version'
        headers = {
            'Cookie': f'Token={client_token}; RefreshToken={client_token}',
        }
        try:
            response = requests.get(url, headers=headers, verify=False)
            if response.status_code == 200:
                return JsonResponse(response.json(),safe=False)
            else:
                return JsonResponse({'error': response.json()}, status=response.status_code)
        except requests.RequestException as e:
            return JsonResponse({'error': str(e)}, status=500)
    @csrf_exempt
    def get_types(self, request):
        data = json.loads(request.body)
        client_token = data.get('client_token')
        payload = data.get('data')
        tenant=payload.get('tenant')
        site= payload.get('site')
        url = f'https://{site}.digitalberry.fr/settings.json?frontVersion=dev-version'
        headers = {
            'Cookie': f'Token={client_token}; RefreshToken={client_token}',
        }
        try:
            response = requests.get(url, headers=headers, verify=False)
            if response.status_code == 200:
                return JsonResponse(response.json(),safe=False)
            else:
                return JsonResponse({'error': response.json()}, status=response.status_code)
        except requests.RequestException as e:
            return JsonResponse({'error': str(e)}, status=500)

    @csrf_exempt
    def get_end_entity_profiles(self, request):
        data = json.loads(request.body)
        client_token = data.get('client_token')
        payload = data.get('data')
        tenant=payload.get('tenant')
        site= payload.get('site')
        url = f'https://{site}.digitalberry.fr/bcs-berrycertcore/api/v1/end_entity_profiles/?tenant__in={tenant}&frontVersion=dev-version'
        headers = {
            'Cookie': f'Token={client_token}; RefreshToken={client_token}',
        }
        try:
            response = requests.get(url, headers=headers, verify=False)
            if response.status_code == 200:
                return JsonResponse(response.json(),safe=False)
            else:
                return JsonResponse({'error': response.json()}, status=response.status_code)
        except requests.RequestException as e:
            return JsonResponse({'error': str(e)}, status=500)


class AuthenticationView(View):
    @csrf_exempt
    def perform_login(self, request):
        payload = json.loads(request.body)
        email_input = payload.get('username')
        password_input = payload.get('password')
        site= payload.get('site')
        data = {
            "username": email_input,
            "password": password_input
        }
        url = f"https://{site}.digitalberry.fr/api/v1/auth/"
        try:
            response = requests.post(url, json=data,verify=False)
            if response.status_code == 200:
                return JsonResponse(response.json(),safe=False)
            else:
                return JsonResponse({'error': response.json()}, status=response.status_code)    
        except requests.RequestException as e:
            return JsonResponse({'error': str(e)}, status=500)

    @csrf_exempt
    def vault_login(self, request): 
        if request.method == 'POST':
            role_value = request.POST.get('roleValue')
            email_value = request.POST.get('emailValue')
            password_value = request.POST.get('passwordValue')

            last_response_body = Utils.vault_handle_login(role_value, email_value, password_value)

           
            if not last_response_body:
                return JsonResponse({'error': 'Empty response from server'})

            try:
                json_response = json.loads(last_response_body)
                
                if 'auth' in json_response:
                    client_token = json_response['auth'].get('client_token') 
                else:
                    return JsonResponse({'error': 'Invalid response format'})
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON response'})

            response_data = {
                'message': f'role:{role_value}, Email: {email_value}, Password: {password_value}',
                'last_response_body': last_response_body,
                'client_token': client_token,
                'message': 'Login successful. Closing window...',
                'login_status': 'success'
            }

            return JsonResponse(response_data)
        else:
            return JsonResponse({'error': 'Invalid request'})


class Utils:
    @classmethod
    def vault_handle_login(cls, role_value, email_value, password_value):
        try:
            payload = {
                "role": role_value,
                "redirect_uri": "https://vault.digitalberry.fr/ui/vault/auth/oidc/oidc/callback"
            }

            url = "https://vault.digitalberry.fr/v1/auth/oidc/oidc/auth_url"

            session = requests.Session()
            response = session.post(url, json=payload, verify=False)
            auth_url = response.json()["data"]["auth_url"]

            response = session.get(auth_url, verify=False)
            action_url = cls.extract_action(response.text)

            payload = {
                "username": email_value,
                "password": password_value,
                "credentialId": ""
            }
            
            response = session.post(action_url, data=payload, allow_redirects=False, verify=False)
            
            
            if 'Location' not in response.headers:
                return "Redirect location not found in response headers"
            
            state, code = cls.extract_state_and_code(response.headers['Location'])

            callback_url = f"https://vault.digitalberry.fr/v1/auth/oidc/oidc/callback?state={state}&code={code}"
            response = session.get(callback_url, verify=False)

            return response.text
        except requests.RequestException as e:
            return str(e)

    @staticmethod
    def extract_state_and_code(callback_url):
        parsed_url = urlparse(callback_url)
        query_params = parse_qs(parsed_url.query)
        state = query_params.get('state', [''])[0]
        code = query_params.get('code', [''])[0]
        return state, code


    @staticmethod
    def extract_action(html_content):
        soup = BeautifulSoup(html_content, 'html.parser')
        form = soup.find('form', id='kc-form-login')
        if form and form.has_attr('action'):
            return form['action']
        else:
            return None
