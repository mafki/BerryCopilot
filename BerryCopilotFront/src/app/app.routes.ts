import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreatePkiFormComponent } from './components/shared/create-pki-form/create-pki-form.component';
import { PkiResultComponent } from './components/shared/pki-result/pki-result.component';
import { LoginComponent } from './components/login/login.component';
import { RootComponent } from './components/root/root.component';
import { CreateUsageFormComponent } from './components/shared/create-usage-form/create-usage-form.component';
import { UsageResultComponent } from './components/shared/usage-result/usage-result.component';
import { CreateServerFormComponent } from './components/shared/create-server-form/create-server-form.component';
import { ServerResultComponent } from './components/shared/server-result/server-result.component';
import { CreateScanFormComponent } from './components/shared/create-scan-form/create-scan-form.component';
import { ScanResultComponent } from './components/shared/scan-result/scan-result.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', component: RootComponent,children: [
        //dashboard path
        { path: 'dashboard', component: DashboardComponent, pathMatch: 'full', canActivate: [AuthGuard]},
        //usage and pki paths
        { path: 'create-pki-form', component: CreatePkiFormComponent, pathMatch: 'full', canActivate: [AuthGuard]},
        { path: 'pki-result', component: PkiResultComponent, pathMatch: 'full', canActivate: [AuthGuard]},
        { path: 'create-usage-form', component: CreateUsageFormComponent, pathMatch: 'full', canActivate: [AuthGuard]},
        { path: 'usage-result', component: UsageResultComponent, pathMatch: 'full', canActivate: [AuthGuard]},
        //server and scan paths
        { path: 'create-server-form', component: CreateServerFormComponent, pathMatch: 'full', canActivate: [AuthGuard]},
        { path: 'server-result', component: ServerResultComponent, pathMatch: 'full', canActivate: [AuthGuard]},
        { path: 'create-scan-form', component: CreateScanFormComponent, pathMatch: 'full', canActivate: [AuthGuard]},
        { path: 'scan-result', component: ScanResultComponent, pathMatch: 'full', canActivate: [AuthGuard]},
        //default path
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ], canActivate: [AuthGuard]
    },
   

];
