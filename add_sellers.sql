-- Add seller data
INSERT INTO profiles (id, email, full_name, company_name, role, is_verified, wallet_balance) VALUES
('sel-001', 'hayaland@hw.com', 'Hayaland Electronics', 'Hayaland Wholesale Ltd', 'seller', true, 5000000),
('sel-002', 'applestore@hw.com', 'Apple Store Japan', 'Apple Japan Inc', 'seller', true, 10000000),
('sel-003', 'sonycenter@hw.com', 'Sony Center Tokyo', 'Sony Corporation Japan', 'seller', true, 3500000),
('sel-004', 'canonpro@hw.com', 'Canon Pro Shop', 'Canon Marketing Japan', 'seller', true, 2500000);

-- Update auctions to link to sellers
UPDATE auctions SET seller_id = 'sel-001' WHERE id = 'c5649ccb-293d-474c-b598-2fc58f5cf701';
UPDATE auctions SET seller_id = 'sel-001' WHERE id = '2ad20654-2cf4-49e9-8b24-03af7059b1c1';
UPDATE auctions SET seller_id = 'sel-001' WHERE id = '3c2bab2e-f4ea-4b93-9d44-5b192c6f06b8';
UPDATE auctions SET seller_id = 'sel-002' WHERE id = '72405411-9e0a-43f4-a975-fb4f0a467c16';
UPDATE auctions SET seller_id = 'sel-001' WHERE id = '5555e2e6-8322-4426-8023-7008e7c4db35';
UPDATE auctions SET seller_id = 'sel-004' WHERE id = 'e8d861f1-88e9-455f-9d38-7bec22b97ef7';
