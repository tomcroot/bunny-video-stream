<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            'manage users',
            'manage content',
            'manage reviews',
            'manage banners',
            'manage cast',
            'manage gallery',
            'manage emails',
            'manage sms',
            'view admin dashboard',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create admin role and assign all permissions
        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        // Create user role with limited permissions
        $userRole = Role::create(['name' => 'user']);

        // Optionally assign admin role to the first user
        // $admin = \App\Models\User::first();
        // if ($admin) {
        //     $admin->assignRole('admin');
        // }
    }
}
