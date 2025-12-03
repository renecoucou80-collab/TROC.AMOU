#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
import os
import tempfile
from pathlib import Path

class CommunityPlatformTester:
    def __init__(self, base_url="https://helpful-exchange.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.passed_tests = []

    def log_result(self, test_name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            self.passed_tests.append(test_name)
            print(f"✅ {test_name} - PASSED")
        else:
            self.failed_tests.append({"test": test_name, "details": details})
            print(f"❌ {test_name} - FAILED: {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, files=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
        
        if self.token and 'Authorization' not in test_headers:
            test_headers['Authorization'] = f'Bearer {self.token}'

        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        print(f"   Method: {method}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                if files:
                    # Remove Content-Type for multipart/form-data
                    if 'Content-Type' in test_headers:
                        del test_headers['Content-Type']
                    response = requests.post(url, data=data, files=files, headers=test_headers, timeout=30)
                else:
                    response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=30)

            print(f"   Status: {response.status_code}")
            
            success = response.status_code == expected_status
            details = ""
            
            if not success:
                details = f"Expected {expected_status}, got {response.status_code}"
                try:
                    error_detail = response.json()
                    details += f" - {error_detail}"
                except:
                    details += f" - {response.text[:200]}"
            
            self.log_result(name, success, details)
            
            if success:
                try:
                    return True, response.json()
                except:
                    return True, response.text
            else:
                return False, details

        except Exception as e:
            error_msg = f"Request failed: {str(e)}"
            self.log_result(name, False, error_msg)
            return False, error_msg

    def test_admin_login(self):
        """Test admin login functionality"""
        print("\n" + "="*50)
        print("TESTING ADMIN AUTHENTICATION")
        print("="*50)
        
        # Test with correct credentials
        success, response = self.run_test(
            "Admin Login - Valid Credentials",
            "POST",
            "admin/login",
            200,
            data={"username": "admin", "password": "admin123"}
        )
        
        if success and isinstance(response, dict) and 'access_token' in response:
            self.token = response['access_token']
            print(f"   Token obtained: {self.token[:20]}...")
            return True
        
        # Test with invalid credentials
        self.run_test(
            "Admin Login - Invalid Credentials",
            "POST", 
            "admin/login",
            401,
            data={"username": "wrong", "password": "wrong"}
        )
        
        return False

    def test_donations_api(self):
        """Test donations CRUD operations"""
        print("\n" + "="*50)
        print("TESTING DONATIONS API")
        print("="*50)
        
        # Test creating donation without photos
        success, response = self.run_test(
            "Create Donation - No Photos",
            "POST",
            "donations",
            200,
            data={"phone": "0612345678"},
            files=None,
            headers={}
        )
        
        donation_id = None
        if success and isinstance(response, dict) and 'id' in response:
            donation_id = response['id']
            print(f"   Created donation ID: {donation_id}")
        
        # Test creating donation with mock photo
        try:
            # Create a temporary image file
            with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp_file:
                tmp_file.write(b'fake image content for testing')
                tmp_file_path = tmp_file.name
            
            with open(tmp_file_path, 'rb') as f:
                files = {'files': ('test.jpg', f, 'image/jpeg')}
                success, response = self.run_test(
                    "Create Donation - With Photo",
                    "POST",
                    "donations", 
                    200,
                    data={"phone": "0687654321"},
                    files=files,
                    headers={}
                )
            
            # Clean up temp file
            os.unlink(tmp_file_path)
            
        except Exception as e:
            self.log_result("Create Donation - With Photo", False, f"File upload test failed: {str(e)}")
        
        # Test getting all donations
        self.run_test(
            "Get All Donations",
            "GET",
            "donations",
            200
        )
        
        # Test deleting donation (admin only)
        if donation_id and self.token:
            self.run_test(
                "Delete Donation - Admin",
                "DELETE",
                f"donations/{donation_id}",
                200
            )
        
        # Test deleting donation without auth
        if donation_id:
            temp_token = self.token
            self.token = None
            self.run_test(
                "Delete Donation - No Auth",
                "DELETE", 
                f"donations/{donation_id}",
                403
            )
            self.token = temp_token

    def test_sales_api(self):
        """Test sales CRUD operations"""
        print("\n" + "="*50)
        print("TESTING SALES API")
        print("="*50)
        
        # Test creating sale without photos
        success, response = self.run_test(
            "Create Sale - No Photos",
            "POST",
            "sales",
            200,
            data={
                "phone": "0612345678",
                "description": "Test item for sale",
                "price": "25.50"
            },
            files=None,
            headers={}
        )
        
        sale_id = None
        if success and isinstance(response, dict) and 'id' in response:
            sale_id = response['id']
            print(f"   Created sale ID: {sale_id}")
        
        # Test creating sale with mock photo
        try:
            with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp_file:
                tmp_file.write(b'fake image content for testing')
                tmp_file_path = tmp_file.name
            
            with open(tmp_file_path, 'rb') as f:
                files = {'files': ('test.jpg', f, 'image/jpeg')}
                success, response = self.run_test(
                    "Create Sale - With Photo",
                    "POST",
                    "sales",
                    200,
                    data={
                        "phone": "0687654321", 
                        "description": "Another test item",
                        "price": "15.00"
                    },
                    files=files,
                    headers={}
                )
            
            os.unlink(tmp_file_path)
            
        except Exception as e:
            self.log_result("Create Sale - With Photo", False, f"File upload test failed: {str(e)}")
        
        # Test getting all sales
        self.run_test(
            "Get All Sales",
            "GET",
            "sales", 
            200
        )
        
        # Test deleting sale (admin only)
        if sale_id and self.token:
            self.run_test(
                "Delete Sale - Admin",
                "DELETE",
                f"sales/{sale_id}",
                200
            )

    def test_tips_api(self):
        """Test tips CRUD operations"""
        print("\n" + "="*50)
        print("TESTING TIPS API")
        print("="*50)
        
        # Test getting tips (should work without auth)
        self.run_test(
            "Get All Tips",
            "GET",
            "tips",
            200
        )
        
        # Test creating tip (admin only)
        if self.token:
            success, response = self.run_test(
                "Create Tip - Admin",
                "POST",
                "tips",
                200,
                data={
                    "title": "Test Tip",
                    "category": "Plomberie", 
                    "content": "This is a test tip for plumbing."
                }
            )
            
            tip_id = None
            if success and isinstance(response, dict) and 'id' in response:
                tip_id = response['id']
                print(f"   Created tip ID: {tip_id}")
                
                # Test deleting tip
                self.run_test(
                    "Delete Tip - Admin",
                    "DELETE",
                    f"tips/{tip_id}",
                    200
                )
        
        # Test creating tip without auth
        temp_token = self.token
        self.token = None
        self.run_test(
            "Create Tip - No Auth",
            "POST",
            "tips",
            403,
            data={
                "title": "Unauthorized Tip",
                "category": "Test",
                "content": "This should fail."
            }
        )
        self.token = temp_token

    def test_file_uploads(self):
        """Test file upload limits and validation"""
        print("\n" + "="*50)
        print("TESTING FILE UPLOAD LIMITS")
        print("="*50)
        
        try:
            # Test uploading more than 3 files (should fail)
            temp_files = []
            files_dict = {}
            
            for i in range(4):  # Create 4 files (exceeds limit of 3)
                tmp_file = tempfile.NamedTemporaryFile(suffix='.jpg', delete=False)
                tmp_file.write(f'fake image content {i}'.encode())
                tmp_file.close()
                temp_files.append(tmp_file.name)
                files_dict[f'files'] = (f'test{i}.jpg', open(tmp_file.name, 'rb'), 'image/jpeg')
            
            # This should fail with 400 status
            self.run_test(
                "Upload Too Many Files",
                "POST",
                "donations",
                400,
                data={"phone": "0612345678"},
                files=files_dict,
                headers={}
            )
            
            # Clean up
            for f in files_dict.values():
                if hasattr(f[1], 'close'):
                    f[1].close()
            for tmp_file in temp_files:
                try:
                    os.unlink(tmp_file)
                except:
                    pass
                    
        except Exception as e:
            self.log_result("Upload Too Many Files", False, f"File limit test failed: {str(e)}")

    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting Community Platform API Tests")
        print(f"Backend URL: {self.base_url}")
        print(f"API URL: {self.api_url}")
        
        # Test admin authentication first
        admin_login_success = self.test_admin_login()
        
        # Test all API endpoints
        self.test_donations_api()
        self.test_sales_api() 
        self.test_tips_api()
        self.test_file_uploads()
        
        # Print final results
        print("\n" + "="*60)
        print("FINAL TEST RESULTS")
        print("="*60)
        print(f"Total tests run: {self.tests_run}")
        print(f"Tests passed: {self.tests_passed}")
        print(f"Tests failed: {len(self.failed_tests)}")
        print(f"Success rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for failure in self.failed_tests:
                print(f"   - {failure['test']}: {failure['details']}")
        
        if self.passed_tests:
            print(f"\n✅ PASSED TESTS ({len(self.passed_tests)}):")
            for test in self.passed_tests:
                print(f"   - {test}")
        
        return {
            "total_tests": self.tests_run,
            "passed_tests": self.tests_passed,
            "failed_tests": len(self.failed_tests),
            "success_rate": (self.tests_passed/self.tests_run)*100 if self.tests_run > 0 else 0,
            "failures": self.failed_tests,
            "passed": self.passed_tests
        }

def main():
    tester = CommunityPlatformTester()
    results = tester.run_all_tests()
    
    # Return appropriate exit code
    return 0 if results["failed_tests"] == 0 else 1

if __name__ == "__main__":
    sys.exit(main())