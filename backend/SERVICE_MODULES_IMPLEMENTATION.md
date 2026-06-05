# Service Modules Implementation Summary

## ✅ Files Created

### Migrations (7 files)
- `2025_11_04_000001_create_user_profiles_table.php`
- `2025_11_04_000002_create_vehicles_table.php`
- `2025_11_04_000003_create_service_requests_table.php`
- `2025_11_04_000004_create_maintenance_requests_table.php`
- `2025_11_04_000005_create_parts_accessories_requests_table.php`
- `2025_11_04_000006_create_insurance_requests_table.php`
- `2025_11_04_000007_create_other_service_requests_table.php`

### Models (7 files)
- `app/Models/ServiceRequest.php`
- `app/Models/MaintenanceRequest.php`
- `app/Models/PartsAccessoriesRequest.php`
- `app/Models/InsuranceRequest.php`
- `app/Models/OtherServiceRequest.php`
- `app/Models/Vehicle.php`
- `app/Models/UserProfile.php`

### Controllers (5 files)
- `app/Http/Controllers/API/V1/MaintenanceRequestController.php`
- `app/Http/Controllers/API/V1/PartsAccessoriesRequestController.php`
- `app/Http/Controllers/API/V1/InsuranceRequestController.php`
- `app/Http/Controllers/API/V1/OtherServiceRequestController.php`
- `app/Http/Controllers/API/V1/VehicleController.php`

### Request Validators (4 files)
- `app/Http/Requests/MaintenanceRequestRequest.php`
- `app/Http/Requests/PartsAccessoriesRequestRequest.php`
- `app/Http/Requests/InsuranceRequestRequest.php`
- `app/Http/Requests/OtherServiceRequestRequest.php`

### Documentation
- `API_DOCUMENTATION.md` - Complete API documentation for frontend

### Routes
- Updated `routes/api.php` - Added new service routes without affecting existing routes

---

## 🔧 Setup Instructions

### 1. Run Migrations
```bash
php artisan migrate
```

### 2. Add is_admin Column to Users Table
Create a new migration:
```bash
php artisan make:migration add_is_admin_to_users_table
```

Add this to the migration:
```php
public function up()
{
    Schema::table('users', function (Blueprint $table) {
        $table->boolean('is_admin')->default(false)->after('email');
    });
}

public function down()
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn('is_admin');
    });
}
```

Then run:
```bash
php artisan migrate
```

### 3. Configure Storage
```bash
php artisan storage:link
```

### 4. Update User Model
Add to `app/Models/User.php`:
```php
protected $fillable = [
    // ... existing fields
    'is_admin',
];

protected $casts = [
    // ... existing casts
    'is_admin' => 'boolean',
];

public function vehicles()
{
    return $this->hasMany(Vehicle::class);
}

public function serviceRequests()
{
    return $this->hasMany(ServiceRequest::class);
}

public function userProfiles()
{
    return $this->hasMany(UserProfile::class);
}
```

---

## 📡 API Endpoints

All endpoints use JWT authentication (`jwt.auth` middleware) and are prefixed with `/api/v1/`

### Vehicle Management
- `GET /api/v1/vehicles` - Get user's vehicles
- `POST /api/v1/vehicles` - Add new vehicle
- `GET /api/v1/vehicles/{id}` - Get vehicle details

### Maintenance Requests
- `POST /api/v1/maintenance-requests` - Submit maintenance request
- `GET /api/v1/maintenance-requests` - Get user's maintenance requests (admin sees all)
- `GET /api/v1/maintenance-requests/{id}` - Get specific request

### Parts & Accessories Requests
- `POST /api/v1/parts-requests` - Submit parts request
- `GET /api/v1/parts-requests` - Get user's parts requests (admin sees all)
- `GET /api/v1/parts-requests/{id}` - Get specific request

### Insurance Requests
- `POST /api/v1/insurance-requests` - Submit insurance request
- `GET /api/v1/insurance-requests` - Get user's insurance requests (admin sees all)
- `GET /api/v1/insurance-requests/{id}` - Get specific request

### Other Service Requests
- `POST /api/v1/other-service-requests` - Submit other service request
- `GET /api/v1/other-service-requests` - Get user's other requests (admin sees all)
- `GET /api/v1/other-service-requests/{id}` - Get specific request

---

## 🔐 Authorization Rules

### Regular Users
- Can only view their own service requests
- Can submit new requests for all service types
- Cannot view other users' requests
- Must provide personal information (full_name, phone, email, address) for each request

### Admin Users (is_admin = true)
- Can view all service requests from all users
- Can access any request details
- Full access to all endpoints

---

## 📋 Required Fields for Each Service

### All Services (Common)
- `full_name` - required
- `phone` - required
- `email` - required
- `address` - required
- `preferred_contact` - required (phone, email, whatsapp)

### Maintenance Request
- `vehicle_id` - required
- `workshop_type` - required (authorized, independent)
- `service_category` - required (general, ev-hybrid, mechanical, electrical-battery, ac-cooling)
- `agreement_signed` - required (must be true)

### Parts Request
- `vehicle_id` - required
- `request_for` - required (parts, accessories, both)
- `item_type` - required (oem, aftermarket, reconditioned)
- `item_name` - required
- `quantity` - required
- `delivery_method` - required (home, pickup)

### Insurance Request
- `insurance_type` - required (third_party, comprehensive, claim_assistance, renewal_reminder)
- `vehicle_type` - required (ev, ice, hybrid)
- `vehicle_condition` - required (new, used)

### Other Service Request
- `service_category` - required (cosmetic, workshop_special, roadside, telematics, other)
- `custom_service_name` - required if service_category is 'other'

---

## 🗂️ Database Structure

### service_requests (Parent Table)
Stores common information for all service types:
- Links to user and vehicle
- Tracks service_type, status, preferred_contact
- Manages pickup/delivery preferences

### Module-Specific Tables
Each service module has its own table:
- `maintenance_requests`
- `parts_accessories_requests`
- `insurance_requests`
- `other_service_requests`

All linked to `service_requests` via `service_request_id`

### user_profiles
Stores alternate contact information provided during service requests

### vehicles
Stores user vehicle information

---

## 🧪 Testing

### Test with Postman/Insomnia

1. **Login to get JWT token**
```
POST /api/v1/login
{
  "email": "user@example.com",
  "password": "password"
}
```

2. **Add Authorization Header**
```
Authorization: Bearer {your_jwt_token}
```

3. **Add a Vehicle**
```
POST /api/v1/vehicles
{
  "brand": "Toyota",
  "model": "Camry",
  "year": 2023,
  "fuel_type": "hybrid"
}
```

4. **Submit Maintenance Request**
```
POST /api/v1/maintenance-requests
{
  "vehicle_id": 1,
  "full_name": "John Doe",
  "phone": "+1234567890",
  "email": "john@example.com",
  "address": "123 Main St",
  "workshop_type": "authorized",
  "service_category": "general",
  "preferred_contact": "phone",
  "agreement_signed": true
}
```

---

## 📝 Notes

- All file uploads are stored in `storage/app/public/`
- Maximum file size: 5MB
- Personal information is mandatory for all service requests
- Service request status flow: new → in_review → approved → completed/rejected
- Admin users need `is_admin = true` in users table
- All routes are protected with JWT authentication
- No existing features were modified or removed

---

## 🚀 Frontend Integration

See `API_DOCUMENTATION.md` for complete API documentation with:
- Request/response examples
- Validation rules
- Error handling
- JavaScript integration examples
