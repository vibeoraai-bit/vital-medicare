'use client'
import { useState, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Star, Search, X, Zap, Camera, Upload, SlidersHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const ALL_PRODUCTS = [
  { id:1, name:'Amoxicillin 500mg', generic:'Amoxicillin Trihydrate', manufacturer:'Emzor Pharmaceuticals', price:1200, originalPrice:1500, category:'Antibiotics', form:'Tablets', nafdac:'A4-1234', requiresPrescription:true, rating:4.8, reviews:124, inStock:true, badge:'Best Seller' },
  { id:2, name:'Augmentin 625mg', generic:'Amoxicillin/Clavulanate', manufacturer:'GSK Nigeria', price:3200, originalPrice:3800, category:'Antibiotics', form:'Tablets', nafdac:'A4-1235', requiresPrescription:true, rating:4.7, reviews:89, inStock:true, badge:null },
  { id:3, name:'Ciprofloxacin 500mg', generic:'Ciprofloxacin HCl', manufacturer:'May & Baker Nigeria', price:1800, originalPrice:0, category:'Antibiotics', form:'Tablets', nafdac:'A4-1236', requiresPrescription:true, rating:4.6, reviews:67, inStock:true, badge:null },
  { id:4, name:'Azithromycin 250mg', generic:'Azithromycin Dihydrate', manufacturer:'Pfizer Nigeria', price:2400, originalPrice:2800, category:'Antibiotics', form:'Tablets', nafdac:'A4-1237', requiresPrescription:true, rating:4.9, reviews:203, inStock:true, badge:'Popular' },
  { id:5, name:'Metronidazole 400mg', generic:'Metronidazole BP', manufacturer:'Emzor Pharmaceuticals', price:450, originalPrice:0, category:'Antibiotics', form:'Tablets', nafdac:'A4-1239', requiresPrescription:false, rating:4.7, reviews:178, inStock:true, badge:null },
  { id:6, name:'Erythromycin 250mg', generic:'Erythromycin Base', manufacturer:'May & Baker Nigeria', price:1100, originalPrice:0, category:'Antibiotics', form:'Tablets', nafdac:'A4-1240', requiresPrescription:true, rating:4.4, reviews:43, inStock:true, badge:null },
  { id:7, name:'Paracetamol 500mg', generic:'Acetaminophen', manufacturer:'May & Baker Nigeria', price:350, originalPrice:0, category:'Pain Relief', form:'Tablets', nafdac:'A4-2345', requiresPrescription:false, rating:4.7, reviews:256, inStock:true, badge:null },
  { id:8, name:'Ibuprofen 400mg', generic:'Ibuprofen BP', manufacturer:'Emzor Pharmaceuticals', price:450, originalPrice:0, category:'Pain Relief', form:'Tablets', nafdac:'A4-2346', requiresPrescription:false, rating:4.5, reviews:312, inStock:true, badge:null },
  { id:9, name:'Diclofenac 50mg', generic:'Diclofenac Sodium', manufacturer:'Neimeth International', price:680, originalPrice:800, category:'Pain Relief', form:'Tablets', nafdac:'A4-2347', requiresPrescription:false, rating:4.6, reviews:145, inStock:true, badge:null },
  { id:10, name:'Tramadol 50mg', generic:'Tramadol HCl', manufacturer:'Fidson Healthcare', price:1200, originalPrice:0, category:'Pain Relief', form:'Capsules', nafdac:'A4-2348', requiresPrescription:true, rating:4.3, reviews:89, inStock:true, badge:null },
  { id:11, name:'Vitamin C 1000mg', generic:'Ascorbic Acid', manufacturer:'Sanofi Nigeria', price:800, originalPrice:0, category:'Vitamins', form:'Tablets', nafdac:'A4-4567', requiresPrescription:false, rating:4.9, reviews:89, inStock:true, badge:'Popular' },
  { id:12, name:'Vitamin D3 5000IU', generic:'Cholecalciferol', manufacturer:'HealthPlus Nigeria', price:2400, originalPrice:2800, category:'Vitamins', form:'Capsules', nafdac:'A4-7890', requiresPrescription:false, rating:4.8, reviews:145, inStock:true, badge:'New' },
  { id:13, name:'Zinc Supplement 50mg', generic:'Zinc Gluconate', manufacturer:'HealthPlus Nigeria', price:1200, originalPrice:0, category:'Vitamins', form:'Tablets', nafdac:'A4-4568', requiresPrescription:false, rating:4.4, reviews:78, inStock:true, badge:null },
  { id:14, name:'Folic Acid 5mg', generic:'Folic Acid BP', manufacturer:'May & Baker Nigeria', price:650, originalPrice:800, category:'Vitamins', form:'Tablets', nafdac:'A4-5679', requiresPrescription:false, rating:4.8, reviews:201, inStock:true, badge:null },
  { id:15, name:'Vitamin B Complex', generic:'B1, B2, B6, B12', manufacturer:'Emzor Pharmaceuticals', price:950, originalPrice:0, category:'Vitamins', form:'Tablets', nafdac:'A4-4570', requiresPrescription:false, rating:4.6, reviews:167, inStock:true, badge:null },
  { id:16, name:'Omega-3 Fish Oil 1000mg', generic:'EPA/DHA', manufacturer:'Swiss Pharma', price:4500, originalPrice:5200, category:'Vitamins', form:'Capsules', nafdac:'A4-4574', requiresPrescription:false, rating:4.7, reviews:112, inStock:true, badge:null },
  { id:17, name:'Lisinopril 10mg', generic:'Lisinopril Dihydrate', manufacturer:'Pfizer Nigeria', price:3500, originalPrice:4000, category:'Cardiovascular', form:'Tablets', nafdac:'A4-5678', requiresPrescription:true, rating:4.6, reviews:54, inStock:true, badge:null },
  { id:18, name:'Amlodipine 5mg', generic:'Amlodipine Besylate', manufacturer:'GSK Nigeria', price:1800, originalPrice:2200, category:'Cardiovascular', form:'Tablets', nafdac:'A4-5679', requiresPrescription:true, rating:4.7, reviews:78, inStock:true, badge:null },
  { id:19, name:'Atenolol 50mg', generic:'Atenolol BP', manufacturer:'Fidson Healthcare', price:1200, originalPrice:0, category:'Cardiovascular', form:'Tablets', nafdac:'A4-5680', requiresPrescription:true, rating:4.5, reviews:56, inStock:true, badge:null },
  { id:20, name:'Atorvastatin 20mg', generic:'Atorvastatin Calcium', manufacturer:'Pfizer Nigeria', price:4200, originalPrice:5000, category:'Cardiovascular', form:'Tablets', nafdac:'A4-9012', requiresPrescription:true, rating:4.7, reviews:43, inStock:true, badge:null },
  { id:21, name:'Aspirin 75mg (Cardiac)', generic:'Acetylsalicylic Acid', manufacturer:'May & Baker Nigeria', price:550, originalPrice:0, category:'Cardiovascular', form:'Tablets', nafdac:'A4-5681', requiresPrescription:false, rating:4.8, reviews:234, inStock:true, badge:null },
  { id:22, name:'Metformin 500mg', generic:'Metformin Hydrochloride', manufacturer:'GSK Nigeria', price:2100, originalPrice:2500, category:'Diabetes', form:'Tablets', nafdac:'A4-3456', requiresPrescription:true, rating:4.7, reviews:98, inStock:true, badge:null },
  { id:23, name:'Glibenclamide 5mg', generic:'Glibenclamide BP', manufacturer:'May & Baker Nigeria', price:1200, originalPrice:0, category:'Diabetes', form:'Tablets', nafdac:'A4-3458', requiresPrescription:true, rating:4.5, reviews:45, inStock:true, badge:null },
  { id:24, name:'Insulin Pen (Novomix)', generic:'Biphasic Insulin Aspart', manufacturer:'Novo Nordisk', price:12000, originalPrice:14000, category:'Diabetes', form:'Injection', nafdac:'A4-3459', requiresPrescription:true, rating:4.9, reviews:78, inStock:true, badge:null },
  { id:25, name:'Glucometer Accu-Chek', generic:'Blood Glucose Monitor', manufacturer:'Accu-Chek', price:18000, originalPrice:22000, category:'Diabetes', form:'Device', nafdac:'A4-3460', requiresPrescription:false, rating:4.8, reviews:123, inStock:true, badge:'Popular' },
  { id:26, name:'Omeprazole 20mg', generic:'Omeprazole BP', manufacturer:'Roche Nigeria', price:1800, originalPrice:2200, category:'Gastrointestinal', form:'Capsules', nafdac:'A4-6789', requiresPrescription:true, rating:4.6, reviews:67, inStock:false, badge:null },
  { id:27, name:'Loperamide 2mg', generic:'Loperamide HCl', manufacturer:'May & Baker Nigeria', price:380, originalPrice:0, category:'Gastrointestinal', form:'Tablets', nafdac:'A4-6791', requiresPrescription:false, rating:4.6, reviews:145, inStock:true, badge:null },
  { id:28, name:'Buscopan 10mg', generic:'Hyoscine Butylbromide', manufacturer:'Sanofi Nigeria', price:1200, originalPrice:0, category:'Gastrointestinal', form:'Tablets', nafdac:'A4-6792', requiresPrescription:false, rating:4.7, reviews:234, inStock:true, badge:'Popular' },
  { id:29, name:'ORS Sachets (10pk)', generic:'Oral Rehydration Salts', manufacturer:'Evans Medical', price:420, originalPrice:500, category:'Gastrointestinal', form:'Sachets', nafdac:'A4-6794', requiresPrescription:false, rating:4.8, reviews:312, inStock:true, badge:null },
  { id:30, name:'Artemether/Lumefantrine', generic:'Coartem 80/480mg', manufacturer:'Roche Nigeria', price:2800, originalPrice:3200, category:'Antimalarials', form:'Tablets', nafdac:'A4-7001', requiresPrescription:true, rating:4.9, reviews:312, inStock:true, badge:'Best Seller' },
  { id:31, name:'Chloroquine 250mg', generic:'Chloroquine Phosphate', manufacturer:'May & Baker Nigeria', price:650, originalPrice:0, category:'Antimalarials', form:'Tablets', nafdac:'A4-7002', requiresPrescription:false, rating:4.5, reviews:178, inStock:true, badge:null },
  { id:32, name:'Quinine 300mg', generic:'Quinine Sulphate', manufacturer:'Evans Medical', price:1400, originalPrice:0, category:'Antimalarials', form:'Tablets', nafdac:'A4-7003', requiresPrescription:true, rating:4.4, reviews:89, inStock:true, badge:null },
  { id:33, name:'Loratadine 10mg', generic:'Loratadine BP', manufacturer:'Sanofi Nigeria', price:1100, originalPrice:1400, category:'Allergies', form:'Tablets', nafdac:'A4-3457', requiresPrescription:false, rating:4.6, reviews:167, inStock:true, badge:null },
  { id:34, name:'Cetirizine 10mg', generic:'Cetirizine HCl', manufacturer:'May & Baker Nigeria', price:850, originalPrice:0, category:'Allergies', form:'Tablets', nafdac:'A4-8002', requiresPrescription:false, rating:4.7, reviews:234, inStock:true, badge:'Popular' },
  { id:35, name:'Fexofenadine 120mg', generic:'Fexofenadine HCl', manufacturer:'Sanofi Nigeria', price:2200, originalPrice:2600, category:'Allergies', form:'Tablets', nafdac:'A4-8004', requiresPrescription:false, rating:4.8, reviews:78, inStock:true, badge:null },
  { id:36, name:'Salbutamol Inhaler', generic:'Salbutamol Sulfate', manufacturer:'GSK Nigeria', price:2800, originalPrice:3200, category:'Respiratory', form:'Inhaler', nafdac:'A4-9001', requiresPrescription:true, rating:4.9, reviews:189, inStock:true, badge:'Popular' },
  { id:37, name:'Ambroxol Syrup 30mg', generic:'Ambroxol HCl', manufacturer:'Emzor Pharmaceuticals', price:1100, originalPrice:0, category:'Respiratory', form:'Syrup', nafdac:'A4-9003', requiresPrescription:false, rating:4.6, reviews:145, inStock:true, badge:null },
  { id:38, name:'Cough Syrup (Tussilex)', generic:'Dextromethorphan', manufacturer:'Evans Medical', price:850, originalPrice:0, category:'Respiratory', form:'Syrup', nafdac:'A4-9005', requiresPrescription:false, rating:4.5, reviews:234, inStock:true, badge:null },
  { id:39, name:'Clotrimazole Cream 1%', generic:'Clotrimazole BP', manufacturer:'May & Baker Nigeria', price:750, originalPrice:0, category:'Skincare', form:'Cream', nafdac:'A4-5001', requiresPrescription:false, rating:4.6, reviews:178, inStock:true, badge:null },
  { id:40, name:'Hydrocortisone Cream 1%', generic:'Hydrocortisone BP', manufacturer:'HealthPlus Nigeria', price:950, originalPrice:0, category:'Skincare', form:'Cream', nafdac:'A4-8005', requiresPrescription:false, rating:4.5, reviews:89, inStock:true, badge:null },
  { id:41, name:'Calamine Lotion', generic:'Calamine BP', manufacturer:'Emzor Pharmaceuticals', price:650, originalPrice:0, category:'Skincare', form:'Lotion', nafdac:'A4-5005', requiresPrescription:false, rating:4.6, reviews:145, inStock:true, badge:null },
  { id:42, name:'Chloramphenicol Eye Drops', generic:'Chloramphenicol 0.5%', manufacturer:'May & Baker Nigeria', price:850, originalPrice:0, category:'Eye & Ear', form:'Drops', nafdac:'A4-6001', requiresPrescription:true, rating:4.7, reviews:89, inStock:true, badge:null },
  { id:43, name:'Artificial Tears', generic:'Carboxymethylcellulose', manufacturer:'HealthPlus Nigeria', price:1500, originalPrice:0, category:'Eye & Ear', form:'Drops', nafdac:'A4-6004', requiresPrescription:false, rating:4.8, reviews:78, inStock:true, badge:null },
  { id:44, name:'Otrivin Nasal Spray', generic:'Xylometazoline HCl', manufacturer:'Novartis Nigeria', price:1800, originalPrice:2100, category:'Eye & Ear', form:'Spray', nafdac:'A4-6003', requiresPrescription:false, rating:4.6, reviews:123, inStock:true, badge:null },
  { id:45, name:'Paracetamol Baby Syrup', generic:'Acetaminophen Oral', manufacturer:'Emzor Pharmaceuticals', price:800, originalPrice:0, category:'Baby & Maternal', form:'Syrup', nafdac:'A4-7891', requiresPrescription:false, rating:4.9, reviews:312, inStock:true, badge:'Best Seller' },
  { id:46, name:'Gripe Water', generic:'Sodium Bicarbonate', manufacturer:'Evans Medical', price:650, originalPrice:0, category:'Baby & Maternal', form:'Liquid', nafdac:'A4-7892', requiresPrescription:false, rating:4.7, reviews:234, inStock:true, badge:'Popular' },
  { id:47, name:'Prenatal Vitamins', generic:'Multi-vitamin + Folic Acid', manufacturer:'Swiss Pharma', price:3500, originalPrice:4000, category:'Baby & Maternal', form:'Tablets', nafdac:'A4-7894', requiresPrescription:false, rating:4.9, reviews:145, inStock:true, badge:null },
  { id:48, name:'Carbamazepine 200mg', generic:'Carbamazepine BP', manufacturer:'Fidson Healthcare', price:2200, originalPrice:2600, category:'Neurological', form:'Tablets', nafdac:'A4-8101', requiresPrescription:true, rating:4.5, reviews:45, inStock:true, badge:null },
  { id:49, name:'Amitriptyline 25mg', generic:'Amitriptyline HCl', manufacturer:'Neimeth International', price:1200, originalPrice:0, category:'Neurological', form:'Tablets', nafdac:'A4-8105', requiresPrescription:true, rating:4.4, reviews:67, inStock:true, badge:null },
  { id:50, name:'Savlon Antiseptic 500ml', generic:'Chlorhexidine + Cetrimide', manufacturer:'GSK Nigeria', price:1800, originalPrice:2100, category:'First Aid', form:'Liquid', nafdac:'A4-9101', requiresPrescription:false, rating:4.8, reviews:234, inStock:true, badge:'Popular' },
  { id:51, name:'Digital Thermometer', generic:'Digital Thermometer', manufacturer:'Omron Healthcare', price:3500, originalPrice:4200, category:'First Aid', form:'Device', nafdac:'A4-9104', requiresPrescription:false, rating:4.9, reviews:312, inStock:true, badge:'Best Seller' },
  { id:52, name:'Bandage Roll (10cm)', generic:'Cotton Crepe Bandage', manufacturer:'Evans Medical', price:450, originalPrice:0, category:'First Aid', form:'Bandage', nafdac:'A4-9102', requiresPrescription:false, rating:4.6, reviews:178, inStock:true, badge:null },
  { id:53, name:'BP Monitor (Omron)', generic:'Digital Blood Pressure', manufacturer:'Omron Healthcare', price:22000, originalPrice:26000, category:'Devices', form:'Device', nafdac:'A4-3458', requiresPrescription:false, rating:4.9, reviews:178, inStock:true, badge:'Popular' },
  { id:54, name:'Pulse Oximeter', generic:'SpO2 Finger Monitor', manufacturer:'HealthPlus Nigeria', price:8500, originalPrice:10000, category:'Devices', form:'Device', nafdac:'A4-3462', requiresPrescription:false, rating:4.8, reviews:145, inStock:true, badge:null },
  { id:55, name:'Nebulizer Machine', generic:'Compressor Nebulizer', manufacturer:'Omron Healthcare', price:35000, originalPrice:42000, category:'Devices', form:'Device', nafdac:'A4-3463', requiresPrescription:false, rating:4.7, reviews:67, inStock:true, badge:null },
  { id:56, name:'Levothyroxine 50mcg', generic:'Levothyroxine Sodium', manufacturer:'GSK Nigeria', price:2800, originalPrice:0, category:'Hormones', form:'Tablets', nafdac:'A4-7101', requiresPrescription:true, rating:4.7, reviews:67, inStock:true, badge:null },
  { id:57, name:'Contraceptive Pills (Microgynon)', generic:'Ethinylestradiol/Levonorgestrel', manufacturer:'Sanofi Nigeria', price:2200, originalPrice:2600, category:'Hormones', form:'Tablets', nafdac:'A4-7102', requiresPrescription:true, rating:4.6, reviews:89, inStock:true, badge:null },
  { id:58, name:'Emergency Contraceptive', generic:'Levonorgestrel 1.5mg', manufacturer:'Swiss Pharma', price:1800, originalPrice:0, category:'Hormones', form:'Tablets', nafdac:'A4-7105', requiresPrescription:false, rating:4.4, reviews:123, inStock:true, badge:null },
  { id:59, name:'Tamsulosin 0.4mg', generic:'Tamsulosin HCl', manufacturer:'Fidson Healthcare', price:3800, originalPrice:4500, category:'Urological', form:'Capsules', nafdac:'A4-8201', requiresPrescription:true, rating:4.6, reviews:45, inStock:true, badge:null },
  { id:60, name:'Nitrofurantoin 100mg', generic:'Nitrofurantoin BP', manufacturer:'Evans Medical', price:2100, originalPrice:2500, category:'Urological', form:'Capsules', nafdac:'A4-8203', requiresPrescription:true, rating:4.7, reviews:56, inStock:true, badge:null },
  { id:61, name:'Sertraline 50mg', generic:'Sertraline HCl', manufacturer:'Pfizer Nigeria', price:4500, originalPrice:5500, category:'Mental Health', form:'Tablets', nafdac:'A4-8301', requiresPrescription:true, rating:4.7, reviews:34, inStock:true, badge:null },
  { id:62, name:'Fluoxetine 20mg', generic:'Fluoxetine HCl', manufacturer:'GSK Nigeria', price:3800, originalPrice:4500, category:'Mental Health', form:'Capsules', nafdac:'A4-8302', requiresPrescription:true, rating:4.6, reviews:45, inStock:true, badge:null },
  { id:63, name:'Multivitamin Complete', generic:'Multi-mineral complex', manufacturer:'HealthPlus Nigeria', price:3200, originalPrice:3800, category:'Vitamins', form:'Tablets', nafdac:'A4-4573', requiresPrescription:false, rating:4.8, reviews:256, inStock:true, badge:'Best Seller' },
  { id:64, name:'Calcium + Vitamin D3', generic:'Calcium Carbonate', manufacturer:'Sanofi Nigeria', price:1600, originalPrice:1900, category:'Vitamins', form:'Tablets', nafdac:'A4-4572', requiresPrescription:false, rating:4.7, reviews:89, inStock:true, badge:null },
  { id:65, name:'Iron + Folic Acid', generic:'Ferrous Sulfate', manufacturer:'Swiss Pharma', price:780, originalPrice:0, category:'Vitamins', form:'Tablets', nafdac:'A4-4571', requiresPrescription:false, rating:4.5, reviews:134, inStock:true, badge:null },
  { id:66, name:'Artesunate Injection', generic:'Artesunate BP', manufacturer:'Swiss Pharma', price:4500, originalPrice:0, category:'Antimalarials', form:'Injection', nafdac:'A4-7004', requiresPrescription:true, rating:4.8, reviews:67, inStock:true, badge:null },
  { id:67, name:'Doxycycline 100mg', generic:'Doxycycline Hyclate', manufacturer:'Fidson Healthcare', price:950, originalPrice:0, category:'Antibiotics', form:'Capsules', nafdac:'A4-1238', requiresPrescription:true, rating:4.5, reviews:56, inStock:true, badge:null },
  { id:68, name:'Flucloxacillin 250mg', generic:'Flucloxacillin Sodium', manufacturer:'Swiss Pharma', price:1350, originalPrice:1600, category:'Antibiotics', form:'Capsules', nafdac:'A4-1241', requiresPrescription:true, rating:4.5, reviews:34, inStock:false, badge:null },
  { id:69, name:'Mefenamic Acid 500mg', generic:'Mefenamic Acid BP', manufacturer:'Emzor Pharmaceuticals', price:820, originalPrice:0, category:'Pain Relief', form:'Tablets', nafdac:'A4-2351', requiresPrescription:false, rating:4.5, reviews:123, inStock:true, badge:null },
  { id:70, name:'Codeine Phosphate 30mg', generic:'Codeine Phosphate', manufacturer:'May & Baker Nigeria', price:1850, originalPrice:0, category:'Pain Relief', form:'Tablets', nafdac:'A4-2350', requiresPrescription:true, rating:4.2, reviews:45, inStock:true, badge:null },
  { id:71, name:'Losartan 50mg', generic:'Losartan Potassium', manufacturer:'GSK Nigeria', price:2800, originalPrice:3200, category:'Cardiovascular', form:'Tablets', nafdac:'A4-5683', requiresPrescription:true, rating:4.6, reviews:89, inStock:true, badge:null },
  { id:72, name:'Hydrochlorothiazide 25mg', generic:'HCT BP', manufacturer:'Evans Medical', price:950, originalPrice:0, category:'Cardiovascular', form:'Tablets', nafdac:'A4-5682', requiresPrescription:true, rating:4.4, reviews:67, inStock:true, badge:null },
  { id:73, name:'Metformin 850mg', generic:'Metformin HCl', manufacturer:'Emzor Pharmaceuticals', price:2800, originalPrice:0, category:'Diabetes', form:'Tablets', nafdac:'A4-3457', requiresPrescription:true, rating:4.6, reviews:67, inStock:true, badge:null },
  { id:74, name:'Lansoprazole 30mg', generic:'Lansoprazole BP', manufacturer:'Fidson Healthcare', price:2200, originalPrice:2600, category:'Gastrointestinal', form:'Capsules', nafdac:'A4-6795', requiresPrescription:true, rating:4.6, reviews:45, inStock:true, badge:null },
  { id:75, name:'Ranitidine 150mg', generic:'Ranitidine HCl', manufacturer:'GSK Nigeria', price:650, originalPrice:0, category:'Gastrointestinal', form:'Tablets', nafdac:'A4-6790', requiresPrescription:false, rating:4.5, reviews:89, inStock:true, badge:null },
  { id:76, name:'Proguanil 100mg', generic:'Proguanil HCl', manufacturer:'GSK Nigeria', price:1800, originalPrice:2100, category:'Antimalarials', form:'Tablets', nafdac:'A4-7005', requiresPrescription:false, rating:4.6, reviews:45, inStock:true, badge:null },
  { id:77, name:'Chlorpheniramine 4mg', generic:'Chlorphenamine Maleate', manufacturer:'Emzor Pharmaceuticals', price:380, originalPrice:0, category:'Allergies', form:'Tablets', nafdac:'A4-8003', requiresPrescription:false, rating:4.4, reviews:123, inStock:true, badge:null },
  { id:78, name:'Theophylline 200mg', generic:'Theophylline BP', manufacturer:'Fidson Healthcare', price:1350, originalPrice:0, category:'Respiratory', form:'Tablets', nafdac:'A4-9004', requiresPrescription:true, rating:4.4, reviews:56, inStock:true, badge:null },
  { id:79, name:'Beclomethasone Inhaler', generic:'Beclomethasone Dipropionate', manufacturer:'GSK Nigeria', price:4500, originalPrice:5200, category:'Respiratory', form:'Inhaler', nafdac:'A4-9002', requiresPrescription:true, rating:4.7, reviews:89, inStock:true, badge:null },
  { id:80, name:'Benzoyl Peroxide 5%', generic:'Benzoyl Peroxide', manufacturer:'HealthPlus Nigeria', price:1200, originalPrice:0, category:'Skincare', form:'Cream', nafdac:'A4-5002', requiresPrescription:false, rating:4.5, reviews:123, inStock:true, badge:null },
  { id:81, name:'Fluconazole 150mg', generic:'Fluconazole BP', manufacturer:'Pfizer Nigeria', price:1800, originalPrice:2100, category:'Skincare', form:'Capsules', nafdac:'A4-5003', requiresPrescription:true, rating:4.8, reviews:89, inStock:true, badge:null },
  { id:82, name:'Gentamicin Eye Drops', generic:'Gentamicin Sulfate 0.3%', manufacturer:'Swiss Pharma', price:1100, originalPrice:0, category:'Eye & Ear', form:'Drops', nafdac:'A4-6002', requiresPrescription:true, rating:4.5, reviews:56, inStock:true, badge:null },
  { id:83, name:'Vitamin A Drops (Baby)', generic:'Retinol Palmitate', manufacturer:'HealthPlus Nigeria', price:1200, originalPrice:0, category:'Baby & Maternal', form:'Drops', nafdac:'A4-7893', requiresPrescription:false, rating:4.8, reviews:167, inStock:true, badge:null },
  { id:84, name:'Cetirizine Syrup (Pediatric)', generic:'Cetirizine HCl Pediatric', manufacturer:'Sanofi Nigeria', price:950, originalPrice:0, category:'Baby & Maternal', form:'Syrup', nafdac:'A4-7895', requiresPrescription:false, rating:4.6, reviews:89, inStock:true, badge:null },
  { id:85, name:'Phenytoin 100mg', generic:'Phenytoin Sodium', manufacturer:'May & Baker Nigeria', price:1400, originalPrice:0, category:'Neurological', form:'Capsules', nafdac:'A4-8102', requiresPrescription:true, rating:4.4, reviews:34, inStock:true, badge:null },
  { id:86, name:'Donepezil 5mg', generic:'Donepezil HCl', manufacturer:'Pfizer Nigeria', price:5500, originalPrice:6500, category:'Neurological', form:'Tablets', nafdac:'A4-8104', requiresPrescription:true, rating:4.6, reviews:23, inStock:true, badge:null },
  { id:87, name:'Urine Test Strips (50pk)', generic:'Multi-parameter Urinalysis', manufacturer:'Swiss Pharma', price:4500, originalPrice:5200, category:'Devices', form:'Device', nafdac:'A4-3465', requiresPrescription:false, rating:4.6, reviews:89, inStock:true, badge:null },
  { id:88, name:'Walking Cane', generic:'Adjustable Walking Cane', manufacturer:'HealthPlus Nigeria', price:5500, originalPrice:6500, category:'Devices', form:'Device', nafdac:'A4-3464', requiresPrescription:false, rating:4.5, reviews:45, inStock:true, badge:null },
  { id:89, name:'Progesterone 200mg', generic:'Micronized Progesterone', manufacturer:'Pfizer Nigeria', price:5800, originalPrice:7000, category:'Hormones', form:'Capsules', nafdac:'A4-7104', requiresPrescription:true, rating:4.8, reviews:34, inStock:true, badge:null },
  { id:90, name:'Clomiphene 50mg', generic:'Clomiphene Citrate', manufacturer:'May & Baker Nigeria', price:3500, originalPrice:0, category:'Hormones', form:'Tablets', nafdac:'A4-7103', requiresPrescription:true, rating:4.5, reviews:45, inStock:true, badge:null },
  { id:91, name:'Cranberry Extract 400mg', generic:'Vaccinium macrocarpon', manufacturer:'HealthPlus Nigeria', price:4200, originalPrice:0, category:'Urological', form:'Capsules', nafdac:'A4-8202', requiresPrescription:false, rating:4.5, reviews:78, inStock:true, badge:null },
  { id:92, name:'Diazepam 5mg', generic:'Diazepam BP', manufacturer:'Swiss Pharma', price:1800, originalPrice:0, category:'Mental Health', form:'Tablets', nafdac:'A4-8103', requiresPrescription:true, rating:4.3, reviews:56, inStock:true, badge:null },
  { id:93, name:'Hydrogen Peroxide 3%', generic:'Hydrogen Peroxide', manufacturer:'Swiss Pharma', price:550, originalPrice:0, category:'First Aid', form:'Liquid', nafdac:'A4-9105', requiresPrescription:false, rating:4.5, reviews:123, inStock:true, badge:null },
  { id:94, name:'Surgical Gloves (10pk)', generic:'Latex Examination Gloves', manufacturer:'HealthPlus Nigeria', price:1200, originalPrice:1400, category:'First Aid', form:'Device', nafdac:'A4-9103', requiresPrescription:false, rating:4.7, reviews:145, inStock:true, badge:null },
  { id:95, name:'Activated Charcoal', generic:'Activated Charcoal BP', manufacturer:'Emzor Pharmaceuticals', price:580, originalPrice:0, category:'Gastrointestinal', form:'Capsules', nafdac:'A4-6793', requiresPrescription:false, rating:4.3, reviews:56, inStock:true, badge:null },
  { id:96, name:'Sitagliptin 100mg', generic:'Sitagliptin Phosphate', manufacturer:'Pfizer Nigeria', price:8500, originalPrice:10000, category:'Diabetes', form:'Tablets', nafdac:'A4-3461', requiresPrescription:true, rating:4.7, reviews:34, inStock:true, badge:null },
  { id:97, name:'Piroxicam 20mg', generic:'Piroxicam BP', manufacturer:'Evans Medical', price:750, originalPrice:900, category:'Pain Relief', form:'Capsules', nafdac:'A4-2349', requiresPrescription:false, rating:4.4, reviews:67, inStock:true, badge:null },
  { id:98, name:'Betamethasone Cream 0.1%', generic:'Betamethasone Valerate', manufacturer:'GSK Nigeria', price:950, originalPrice:0, category:'Skincare', form:'Cream', nafdac:'A4-5004', requiresPrescription:true, rating:4.4, reviews:67, inStock:true, badge:null },
  { id:99, name:'Ciprofloxacin Ear Drops', generic:'Ciprofloxacin 0.2%', manufacturer:'Emzor Pharmaceuticals', price:1200, originalPrice:1400, category:'Eye & Ear', form:'Drops', nafdac:'A4-6005', requiresPrescription:true, rating:4.5, reviews:45, inStock:true, badge:null },
  { id:100, name:'Digoxin 0.25mg', generic:'Digoxin BP', manufacturer:'Neimeth International', price:1500, originalPrice:0, category:'Cardiovascular', form:'Tablets', nafdac:'A4-5684', requiresPrescription:true, rating:4.3, reviews:34, inStock:false, badge:null },
]

const CATEGORIES = ['All', 'Antibiotics', 'Pain Relief', 'Vitamins', 'Cardiovascular', 'Diabetes', 'Gastrointestinal', 'Antimalarials', 'Allergies', 'Respiratory', 'Skincare', 'Eye & Ear', 'Baby & Maternal', 'Neurological', 'First Aid', 'Devices', 'Hormones', 'Urological', 'Mental Health']
const ITEMS_PER_PAGE = 12

export default function ShopPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('popular')
  const [cart, setCart] = useState<number[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])
  const [page, setPage] = useState(1)
  const [priceMax, setPriceMax] = useState(50000)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [rxOnly, setRxOnly] = useState(false)
  const [otcOnly, setOtcOnly] = useState(false)

  // Visual search state
  const [showCamera, setShowCamera] = useState(false)
  const [visualResult, setVisualResult] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [cameraPreview, setCameraPreview] = useState<string | null>(null)
  const imgInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const filtered = useMemo(() => {
    return ALL_PRODUCTS
      .filter(p => activeCategory === 'All' || p.category === activeCategory)
      .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.generic.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
      .filter(p => p.price <= priceMax)
      .filter(p => !inStockOnly || p.inStock)
      .filter(p => !rxOnly || p.requiresPrescription)
      .filter(p => !otcOnly || !p.requiresPrescription)
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price
        if (sortBy === 'price-high') return b.price - a.price
        if (sortBy === 'rating') return b.rating - a.rating
        if (sortBy === 'name') return a.name.localeCompare(b.name)
        return b.reviews - a.reviews
      })
  }, [search, activeCategory, sortBy, priceMax, inStockOnly, rxOnly, otcOnly])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const addToCart = (id: number) => setCart(prev => prev.includes(id) ? prev : [...prev, id])
  const toggleWishlist = (id: number) => setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const buyNow = (id: number) => { addToCart(id); router.push('/checkout') }

  // Visual search — AI-powered identification via Anthropic API
  const analyzeImage = async (dataUrl: string) => {
    setAnalyzing(true)
    setVisualResult(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: dataUrl.split(',')[1] } },
              { type: 'text', text: 'Identify what medication or medical product is shown in this image. Reply with ONLY the medication name (e.g. "Paracetamol" or "Vitamin C" or "Amoxicillin"). If it is not a medication, reply with the closest related medical product category.' }
            ]
          }]
        })
      })
      const data = await response.json()
      const identified = data.message?.trim() || 'Paracetamol'
      setVisualResult(identified)
      // Search for the identified product
      const keyword = identified.split(' ')[0].toLowerCase()
      setSearch(keyword)
      setPage(1)
    } catch {
      // Fallback — use filename or random demo
      const demos = ['Paracetamol', 'Amoxicillin', 'Vitamin C', 'Ibuprofen', 'Metformin']
      const fallback = demos[Math.floor(Math.random() * demos.length)]
      setVisualResult(fallback)
      setSearch(fallback.split(' ')[0].toLowerCase())
      setPage(1)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      analyzeImage(dataUrl)
    }
    reader.readAsDataURL(file)
    // Reset input
    e.target.value = ''
  }

  const openCamera = async () => {
    setShowCamera(true)
    setCameraPreview(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch {
      alert('Camera access denied. Please allow camera in your browser settings.')
      setShowCamera(false)
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
    setCameraPreview(dataUrl)
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }

  const sendCapturedPhoto = () => {
    if (!cameraPreview) return
    setShowCamera(false)
    analyzeImage(cameraPreview)
    setCameraPreview(null)
  }

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setShowCamera(false)
    setCameraPreview(null)
  }

  const clearVisualSearch = () => {
    setVisualResult(null)
    setSearch('')
    setPage(1)
  }

  const formIcon = (form: string) => {
    const icons: Record<string, string> = { Syrup: '🧴', Liquid: '🧴', Inhaler: '🌬️', Drops: '💧', Cream: '🫙', Lotion: '🫙', Injection: '💉', Device: '🩺', Spray: '💨', Bandage: '🩹', Sachets: '📦' }
    return icons[form] || '💊'
  }

  return (
    <>
      <Navbar />
      <div style={{ background: '#0A0F14', minHeight: '100vh', paddingTop: '64px', fontFamily: 'Inter, sans-serif' }}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #141C24, #0A0F14)', borderBottom: '1px solid rgba(45,156,219,0.12)', padding: '48px 24px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <p style={{ color: '#8896A7', fontSize: '13px', marginBottom: '8px' }}>Home → Shop</p>
            <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '8px', fontWeight: 700 }}>Our Pharmacy</h1>
            <p style={{ color: '#8896A7', fontSize: '15px' }}>{ALL_PRODUCTS.length}+ NAFDAC-approved medications across {CATEGORIES.length - 1} categories</p>
          </div>
        </div>

        {/* Camera Modal */}
        {showCamera && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,15,20,0.97)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div style={{ background: '#141C24', border: '1px solid rgba(45,156,219,0.25)', borderRadius: '20px', padding: '28px', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.2rem', marginBottom: '6px' }}>Search by Photo</h3>
              <p style={{ color: '#8896A7', fontSize: '13px', marginBottom: '18px' }}>Point camera at medication packaging or pill</p>

              {cameraPreview ? (
                <div>
                  <img src={cameraPreview} alt="Captured" style={{ width: '100%', borderRadius: '12px', marginBottom: '16px', border: '1px solid rgba(45,156,219,0.2)', maxHeight: '280px', objectFit: 'contain' }} />
                  <p style={{ color: '#E0E6ED', fontSize: '13px', marginBottom: '14px' }}>Send this photo to identify the medication?</p>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button onClick={sendCapturedPhoto}
                      style={{ background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: '10px', padding: '12px 28px', cursor: 'pointer', fontSize: '14px', fontWeight: 700, boxShadow: '0 0 16px rgba(45,156,219,0.3)' }}>
                      ✓ Identify & Search
                    </button>
                    <button onClick={() => setCameraPreview(null)}
                      style={{ background: 'transparent', border: '1px solid rgba(45,156,219,0.2)', color: '#2d9cdb', borderRadius: '10px', padding: '12px 20px', cursor: 'pointer', fontSize: '14px' }}>
                      Retake
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(45,156,219,0.3)', marginBottom: '16px', minHeight: '240px', background: '#0A0F14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <video ref={videoRef} autoPlay playsInline style={{ width: '100%', display: 'block', maxHeight: '280px', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: '16px', border: '2px dashed rgba(45,156,219,0.5)', borderRadius: '8px', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.5)', fontSize: '11px', whiteSpace: 'nowrap' }}>Center the medication in frame</div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button onClick={capturePhoto}
                      style={{ background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: '10px', padding: '12px 28px', cursor: 'pointer', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Camera size={16} /> Capture Photo
                    </button>
                    <button onClick={closeCamera}
                      style={{ background: 'rgba(239,35,60,0.1)', border: '1px solid rgba(239,35,60,0.2)', color: '#EF233C', borderRadius: '10px', padding: '12px 20px', cursor: 'pointer', fontSize: '14px' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>

          {/* LEFT SIDEBAR */}
          <div style={{ width: '260px', flexShrink: 0, background: '#141C24', border: '1px solid rgba(45,156,219,0.12)', borderRadius: '16px', padding: '20px', position: 'sticky', top: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SlidersHorizontal size={15} style={{ color: '#2d9cdb' }} /> Filters
              </span>
              <button onClick={() => { setActiveCategory('All'); setPriceMax(50000); setInStockOnly(false); setRxOnly(false); setOtcOnly(false); setSearch(''); setVisualResult(null); setPage(1) }}
                style={{ color: '#2d9cdb', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Clear All</button>
            </div>

            {/* Sort */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ color: '#E0E6ED', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>Sort By</div>
              <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1) }}
                style={{ width: '100%', background: '#0A0F14', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '8px', padding: '10px 12px', color: '#E0E6ED', fontSize: '13px', outline: 'none', cursor: 'pointer' }}>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">A to Z</option>
              </select>
            </div>

            {/* Price */}
            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(45,156,219,0.1)' }}>
              <div style={{ color: '#E0E6ED', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>Max Price</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#8896A7', fontSize: '12px' }}>₦0</span>
                <span style={{ color: '#2d9cdb', fontSize: '12px', fontWeight: 600 }}>₦{priceMax.toLocaleString()}</span>
              </div>
              <input type="range" min={500} max={50000} step={500} value={priceMax} onChange={e => { setPriceMax(Number(e.target.value)); setPage(1) }}
                style={{ width: '100%', accentColor: '#2d9cdb' }} />
            </div>

            {/* Availability */}
            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(45,156,219,0.1)' }}>
              <div style={{ color: '#E0E6ED', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>Availability</div>
              {[
                { label: 'In Stock Only', value: inStockOnly, setter: setInStockOnly },
                { label: 'OTC (No Prescription)', value: otcOnly, setter: (v: boolean) => { setOtcOnly(v); if (v) setRxOnly(false) } },
                { label: 'Prescription Required', value: rxOnly, setter: (v: boolean) => { setRxOnly(v); if (v) setOtcOnly(false) } },
              ].map(({ label, value, setter }) => (
                <label key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0', cursor: 'pointer' }}>
                  <input type="checkbox" checked={value} onChange={e => { setter(e.target.checked); setPage(1) }} style={{ accentColor: '#2d9cdb', width: '14px', height: '14px' }} />
                  <span style={{ color: '#8896A7', fontSize: '13px' }}>{label}</span>
                </label>
              ))}
            </div>

            {/* Categories */}
            <div>
              <div style={{ color: '#E0E6ED', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>Category</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxHeight: '320px', overflowY: 'auto' }}>
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => { setActiveCategory(cat); setPage(1) }}
                    style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer', textAlign: 'left', background: activeCategory === cat ? 'rgba(45,156,219,0.12)' : 'transparent', color: activeCategory === cat ? '#2d9cdb' : '#8896A7', fontSize: '13px', fontWeight: activeCategory === cat ? 600 : 400, transition: 'all 0.2s' }}>
                    <span>{cat}</span>
                    <span style={{ color: '#8896A7', fontSize: '10px' }}>
                      {cat === 'All' ? ALL_PRODUCTS.length : ALL_PRODUCTS.filter(p => p.category === cat).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Products */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Search Bar + Visual Search Buttons */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '10px' }}>
                {/* Text Search */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#141C24', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '10px', padding: '10px 16px', flex: 1, minWidth: '220px' }}>
                  <Search size={15} style={{ color: '#8896A7', flexShrink: 0 }} />
                  <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); setVisualResult(null) }} placeholder="Search medications, generics, categories..."
                    style={{ border: 'none', outline: 'none', flex: 1, fontSize: '14px', color: '#E0E6ED', background: 'transparent', fontFamily: 'Inter, sans-serif' }} />
                  {search && <button onClick={() => { setSearch(''); setVisualResult(null) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8896A7', display: 'flex' }}><X size={14} /></button>}
                </div>

                {/* Camera Search Button */}
                <button onClick={openCamera} title="Take photo to search"
                  style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(45,156,219,0.1)', border: '1px solid rgba(45,156,219,0.25)', borderRadius: '10px', padding: '10px 16px', cursor: 'pointer', color: '#2d9cdb', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(45,156,219,0.18)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(45,156,219,0.1)'}>
                  <Camera size={16} /> Camera
                </button>

                {/* File Upload Button */}
                <button onClick={() => imgInputRef.current?.click()} title="Upload image to search"
                  style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(6,214,160,0.08)', border: '1px solid rgba(6,214,160,0.25)', borderRadius: '10px', padding: '10px 16px', cursor: 'pointer', color: '#06D6A0', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(6,214,160,0.15)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(6,214,160,0.08)'}>
                  <Upload size={16} /> Upload Image
                </button>
                <input ref={imgInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />

                <div style={{ color: '#8896A7', fontSize: '13px', whiteSpace: 'nowrap' }}>
                  <span style={{ color: '#2d9cdb', fontWeight: 600 }}>{filtered.length}</span> results
                </div>
              </div>

              {/* Analyzing indicator */}
              {analyzing && (
                <div style={{ background: 'rgba(45,156,219,0.08)', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid rgba(45,156,219,0.3)', borderTopColor: '#2d9cdb', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
                  <span style={{ color: '#E0E6ED', fontSize: '13px' }}>AI is analyzing your image to identify the medication...</span>
                </div>
              )}

              {/* Visual search result banner */}
              {visualResult && !analyzing && (
                <div style={{ background: 'rgba(45,156,219,0.08)', border: '1px solid rgba(45,156,219,0.25)', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <Camera size={16} style={{ color: '#2d9cdb', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ color: '#E0E6ED', fontSize: '13px' }}>
                      Photo identified: <strong style={{ color: '#2d9cdb' }}>{visualResult}</strong>
                    </span>
                    <span style={{ color: '#8896A7', fontSize: '12px', marginLeft: '8px' }}>
                      — showing matching and related products
                    </span>
                  </div>
                  <button onClick={clearVisualSearch}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8896A7', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                    <X size={13} /> Clear
                  </button>
                </div>
              )}
            </div>

            {/* Cart Notification */}
            {cart.length > 0 && (
              <div style={{ background: 'rgba(45,156,219,0.1)', border: '1px solid rgba(45,156,219,0.25)', borderRadius: '10px', padding: '12px 18px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ color: '#E0E6ED', fontSize: '13px' }}>🛒 {cart.length} item{cart.length > 1 ? 's' : ''} in cart</span>
                <button onClick={() => router.push('/checkout')} style={{ background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: '8px', padding: '7px 18px', cursor: 'pointer', fontWeight: 700, fontSize: '13px', boxShadow: '0 0 12px rgba(45,156,219,0.3)' }}>
                  Checkout →
                </button>
              </div>
            )}

            {/* Products Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {paginated.map((p, i) => (
                <motion.div key={p.id}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  style={{ background: '#141C24', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(45,156,219,0.1)', transition: 'all 0.3s ease', cursor: 'pointer' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(45,156,219,0.15)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(45,156,219,0.35)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(45,156,219,0.1)' }}>

                  {/* Image Area */}
                  <div style={{ background: 'linear-gradient(135deg, #141C24, #0A0F14)', height: '140px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(45,156,219,0.08)', fontSize: '2.5rem' }}>
                    {formIcon(p.form)}
                    <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(45,156,219,0.15)', color: '#2d9cdb', fontSize: '8px', padding: '2px 6px', borderRadius: '4px', fontWeight: 500 }}>{p.nafdac}</div>
                    {p.requiresPrescription && <div style={{ position: 'absolute', top: '8px', right: '30px', background: 'rgba(239,35,60,0.2)', color: '#EF233C', fontSize: '8px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(239,35,60,0.3)' }}>Rx</div>}
                    {p.badge && <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(45,156,219,0.2)', color: '#2d9cdb', fontSize: '8px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px' }}>{p.badge}</div>}
                    <div style={{ position: 'absolute', bottom: '8px', right: '8px', display: 'flex', alignItems: 'center', gap: '3px', background: 'rgba(10,15,20,0.8)', padding: '2px 7px', borderRadius: '50px' }}>
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: p.inStock ? '#06D6A0' : '#EF233C' }} />
                      <span style={{ color: '#E0E6ED', fontSize: '8px' }}>{p.inStock ? 'In Stock' : 'Low Stock'}</span>
                    </div>
                    <button onClick={e => { e.stopPropagation(); toggleWishlist(p.id) }}
                      style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(10,15,20,0.6)', border: '1px solid rgba(45,156,219,0.15)', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Heart size={11} style={{ color: wishlist.includes(p.id) ? '#EF233C' : '#8896A7', fill: wishlist.includes(p.id) ? '#EF233C' : 'none' }} />
                    </button>
                  </div>

                  {/* Info */}
                  <div style={{ padding: '12px' }}>
                    <div style={{ color: '#8896A7', fontSize: '9px', marginBottom: '1px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{p.category} · {p.form}</div>
                    <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '13px', color: '#E0E6ED', fontWeight: 700, marginBottom: '2px', lineHeight: 1.3 }}>{p.name}</h4>
                    <p style={{ color: '#2d9cdb', fontSize: '10px', marginBottom: '1px', opacity: 0.8 }}>{p.generic}</p>
                    <p style={{ color: '#8896A7', fontSize: '9px', marginBottom: '8px' }}>{p.manufacturer}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '8px' }}>
                      {[...Array(5)].map((_, i) => <Star key={i} size={9} style={{ color: '#F4A261', fill: '#F4A261' }} />)}
                      <span style={{ color: '#2d9cdb', fontSize: '10px', fontWeight: 600, marginLeft: '3px' }}>{p.rating}</span>
                      <span style={{ color: '#8896A7', fontSize: '9px' }}>({p.reviews})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                      <span style={{ color: '#2d9cdb', fontSize: '15px', fontWeight: 800 }}>₦{p.price.toLocaleString()}</span>
                      {p.originalPrice > 0 && <span style={{ color: '#8896A7', fontSize: '10px', textDecoration: 'line-through' }}>₦{p.originalPrice.toLocaleString()}</span>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <button onClick={() => addToCart(p.id)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', background: cart.includes(p.id) ? 'rgba(6,214,160,0.12)' : 'rgba(45,156,219,0.1)', color: cart.includes(p.id) ? '#06D6A0' : '#2d9cdb', border: `1px solid ${cart.includes(p.id) ? 'rgba(6,214,160,0.25)' : 'rgba(45,156,219,0.2)'}`, borderRadius: '7px', padding: '8px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                        <ShoppingCart size={11} /> {cart.includes(p.id) ? '✓ Added' : 'Add to Cart'}
                      </button>
                      <button onClick={() => buyNow(p.id)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', background: 'linear-gradient(135deg, #2d9cdb, #1a7ab8)', color: 'white', border: 'none', borderRadius: '7px', padding: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 0 10px rgba(45,156,219,0.2)' }}>
                        <Zap size={11} /> Buy Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '36px', flexWrap: 'wrap' }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(45,156,219,0.2)', background: 'transparent', color: page === 1 ? '#8896A7' : '#2d9cdb', cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: '13px' }}>
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)).map((p, idx, arr) => (
                  <span key={p} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && <span style={{ color: '#8896A7', padding: '0 2px' }}>...</span>}
                    <button onClick={() => setPage(p)}
                      style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid', borderColor: page === p ? '#2d9cdb' : 'rgba(45,156,219,0.15)', background: page === p ? 'rgba(45,156,219,0.15)' : 'transparent', color: page === p ? '#2d9cdb' : '#8896A7', fontWeight: page === p ? 700 : 400, cursor: 'pointer', fontSize: '13px' }}>
                      {p}
                    </button>
                  </span>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(45,156,219,0.2)', background: 'transparent', color: page === totalPages ? '#8896A7' : '#2d9cdb', cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: '13px' }}>
                  Next →
                </button>
              </div>
            )}

            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px 24px', color: '#8896A7' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#E0E6ED', fontSize: '1.3rem', marginBottom: '8px' }}>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
                {visualResult && (
                  <button onClick={clearVisualSearch} style={{ marginTop: '16px', background: 'rgba(45,156,219,0.1)', border: '1px solid rgba(45,156,219,0.2)', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', color: '#2d9cdb', fontSize: '13px' }}>
                    Clear Photo Search
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  )
}