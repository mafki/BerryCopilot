import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class DataStoreService {

  private keyMappings: { [key: string]: string[] } = {
    "FQDN": ['FQDN', 'FQDN ','IP/FQDN'],
    "ip": ['ip', 'IP ','@ip','@IP','IP'],
    "login": ['login', 'Login ','username','Login'],
    "password": ['password',"Password P12",'Password'],
    "port": ['Port', 'port'],
    "protocol": ['protocole', 'Protocol',"protocol"],
    "login web": ['login  Web'],
    "password web": ['password  Web'],
    "login ssh": ['login SSH'],
    "password ssh": ['password SSH'],
    "crt": ['OUTFILE.crt','superadmin.cert'],
    "key": ['OUTFILE.key','superadmin.key'],
    "cred-name": ['cred-name'],
    "pki-name": ['pki-name'],
    "server-name": ['server-name'],
    "type": ['type'],
    "syncstatus": ['syncstatus'],
    "tosync": ["tosync","tosync "],
    "certificates": ["certificates"],
    "certificateAuthorities": ["certificateAuthorities"],
    "certificateProfiles": ["certificateProfiles"],
    "numberOfCertificates": ["numberOfCertificates"],
    "startsyncfrom": ["startsyncfrom"],
    "tenant": ["tenant"],
    "atype": ["atype"],
    "cred-id": ["cred-id"],
    "pki-id": ["pki-id"],
    "user-tenants": ["user-tenants"],
    "path": ["path"],
    "description": ["description","Description"],
    "custom": ["custom"],
    "site": ["site"],
    "usage-name": ["usage-name"],
    "ca": ["ca"],
    "cp": ["cp"],
    "cpr": ["cpr"],
    "key_t": ["key_t"],
    "key_s": ["key_s"],
    "dcsr": ["dcsr"],
    "eep": ["eep"],
    "server-id": ["server-id"],
    "scan-name": ["scan-name"],
    "cpd": ["cpd"],
    "fsp": ["fsp"],
    "servertype": ["servertype"],
    "configpath": ["configpath"],
    "restartcommand": ["restartcommand"],
    
  };

  private payload: { [key: string]: string } = {
    "FQDN": '',
    "ip": '',
    "login": '',
    "password": '',
    "port": '',
    "protocol": '',
    "login web": '',
    "password web": '',
    "login ssh": '',
    "password ssh": '',
    "crt": '',
    "key": '',
    "cred-name": '',
    "pki-name": "",
    "usage-name": "",
    "server-name": "",
    "type":"",
    "syncstatus":"",
    "tosync":"",
    "certificates":"",
    "certificateAuthorities":"",
    "certificateProfiles":"",
    "numberOfCertificates":"",
    "startsyncfrom":"",
    "tenant":"",
    "atype": "",
    "cred-id": "",
    "pki-id": "",
    "user-tenants": "",
    "path": "",
    "description": "",
    "custom": "",
    "site": "",
    "ca": "",
    "cp": "",
    "cpr": "",
    "key_t": "",
    "key_s": "",
    "dcsr": "",
    "eep": "",
    "server-id": "",
    "scan-name": "",
    "cpd": "",
    "fsp": "",
    "servertype":"",
    "configpath":"",
    "restartcommand":"",

  };

  filter(data: string) {
    const tmp = JSON.parse(data);  
    Object.keys(this.payload).forEach(key => {
      const originalValue = this.payload[key];
      const newValue = this.findValue(tmp, this.keyMappings[key]);
      if (newValue !== '') {
        this.payload[key] = newValue;
      } else {
        this.payload[key] = originalValue;
      }
    });

  }
  
  private findValue(obj: any, possibleKeys: string[]): string {
    for (let i = 0; i < possibleKeys.length; i++) {
      if (obj.hasOwnProperty(possibleKeys[i])) {
        return obj[possibleKeys[i]];
      }
    }
    return '';
  }

  setPayload(data: string) {
    this.filter(data);
  }
  getPayload(): string {
    return JSON.stringify(this.payload);
  }
  settenants(data: string): void {
    let tmp1 = JSON.parse(sessionStorage.getItem('data') as any);

    let tmp2 = {
      "site": tmp1.site,
      "email": tmp1.email,
      "nav":tmp1.nav,
      "tenant": data
    }
    const tmp3 = JSON.stringify(tmp2);
    sessionStorage.setItem('data', tmp3);
  }
  setemail(data: string): void {
    let tmp1 = JSON.parse(sessionStorage.getItem('data') as any);

    let tmp2 = {
      "site": tmp1.site,
      "email": data
    }
    const tmp3 = JSON.stringify(tmp2);
    sessionStorage.setItem('data', tmp3);
  }
  setSite(data: string): void {
    let tmp = {
      "site": data
    }
    const tmp2 = JSON.stringify(tmp);
    sessionStorage.setItem('data', tmp2);
  }
  settenant(data: string): void {
    let tmp1 = JSON.parse(sessionStorage.getItem('data') as any);

    let tmp2 = {
      "site": tmp1.site,
      "email": tmp1.email,
      "tenant": tmp1.tenant,
      "tenantid": data,
      "nav":tmp1.nav
    }
    const tmp3 = JSON.stringify(tmp2);
    sessionStorage.setItem('data', tmp3);
  }
  setnav(data: string): void {
    let tmp1 = JSON.parse(sessionStorage.getItem('data') as any);

    let tmp2 = {
      "site": tmp1.site,
      "email": tmp1.email,
      "tenant": tmp1.tenant,
      "nav": data
    }
    const tmp3 = JSON.stringify(tmp2);
    sessionStorage.setItem('data', tmp3);
  }
  getnav(): string {
    return JSON.parse(sessionStorage.getItem('data') as any)['nav'];
  }


}
