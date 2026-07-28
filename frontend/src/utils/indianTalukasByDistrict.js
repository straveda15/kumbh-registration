// Talukas/Tehsils grouped by district name. Covers major districts across
// all Indian states. Keys match the district names in indianDistrictsByState.js.
// A comprehensive seed list — the Taluka combobox also accepts free text for
// unlisted values (see Combobox's `allowCustomValue` in the step component).
export const TALUKAS_BY_DISTRICT = {
  // ─── Andhra Pradesh ───────────────────────────────────────────────────────
  Visakhapatnam: ['Anakapalle', 'Bheemunipatnam', 'Gajuwaka', 'Padmanabham', 'Visakhapatnam'],
  Vijayawada: ['Gannavaram', 'Gudivada', 'Jaggayyapeta', 'Nandigama', 'Tiruvuru'],
  Guntur: ['Bapatla', 'Gurazala', 'Guntur', 'Narasaraopet', 'Ponnur', 'Tenali'],
  Nellore: ['Atmakur', 'Kavali', 'Nellore', 'Sriharikota', 'Sullurpeta'],
  Tirupati: ['Chandragiri', 'Chittoor', 'Nagari', 'Tirupati', 'Srikalahasti'],
  Kurnool: ['Adoni', 'Alur', 'Kurnool', 'Nandyal', 'Yemmiganur'],
  Kadapa: ['Badvel', 'Kadapa', 'Proddatur', 'Rajampet', 'Rajampeta'],

  // ─── Assam ────────────────────────────────────────────────────────────────
  'Kamrup Metropolitan': ['Azara', 'Chandrapur', 'Guwahati', 'Jalukbari', 'North Guwahati', 'Sonapur'],
  Dibrugarh: ['Dibrugarh', 'Joypur', 'Khowang', 'Lahowal', 'Moran'],
  Jorhat: ['Jorhat', 'Teok', 'Titabor'],
  Nagaon: ['Batadrava', 'Kaliabor', 'Nagaon', 'Raha'],
  Tezpur: ['Biswanath', 'Dhekiajuli', 'Sootea', 'Tezpur'],
  Guwahati: ['Azara', 'Dispur', 'Guwahati', 'Jalukbari'],

  // ─── Bihar ────────────────────────────────────────────────────────────────
  Patna: ['Bankipur', 'Danapur', 'Fatuha', 'Khagaul', 'Patna City', 'Phulwari'],
  Gaya: ['Amas', 'Bodh Gaya', 'Gaya', 'Gurua', 'Sherghati', 'Tekari'],
  Bhagalpur: ['Bhagalpur', 'Bihpur', 'Jagdishpur', 'Kahalgaon', 'Naugachhia'],
  Muzaffarpur: ['Bochahan', 'Kanti', 'Motipur', 'Muzaffarpur', 'Saraiya'],
  Darbhanga: ['Benipur', 'Darbhanga', 'Jale', 'Kiratpur', 'Manigachhi'],
  Purnia: ['Amour', 'Baisi', 'Banmankhi', 'Kasba', 'Purnia', 'Rupauli'],

  // ─── Chhattisgarh ─────────────────────────────────────────────────────────
  Raipur: ['Abhanpur', 'Arang', 'Dharsiwa', 'Raipur', 'Tilda-Neora'],
  Bilaspur: ['Bilaspur', 'Bhatapara', 'Kota', 'Mungeli', 'Takhatpur'],
  Korba: ['Katghora', 'Korba', 'Pali', 'Pendra Road'],
  Durg: ['Balod', 'Durg', 'Patan', 'Rajnandgaon'],

  // ─── Goa ──────────────────────────────────────────────────────────────────
  'North Goa': ['Bardez', 'Bicholim', 'Pernem', 'Ponda', 'Satari', 'Tiswadi'],
  'South Goa': ['Canacona', 'Dharbandora', 'Mormugao', 'Quepem', 'Salcete', 'Sanguem'],

  // ─── Gujarat ──────────────────────────────────────────────────────────────
  Ahmedabad: ['Ahmedabad City', 'Bavla', 'City Taluka', 'Detroj-Rampura', 'Dhandhuka', 'Dholera', 'Sanand', 'Viramgam'],
  Surat: ['Bardoli', 'Chorasi', 'Kamrej', 'Mangrol', 'Olpad', 'Palsana', 'Surat City', 'Umarpada'],
  Vadodara: ['Dabhoi', 'Karjan', 'Padra', 'Savli', 'Vadodara City', 'Waghodia'],
  Rajkot: ['Gondal', 'Jasdan', 'Jetpur', 'Kotda Sangani', 'Lodhika', 'Paddhari', 'Rajkot', 'Wankaner'],
  Bhavnagar: ['Bhavnagar', 'Gariadhar', 'Ghogha', 'Mahuva', 'Palitana', 'Sihor', 'Talaja', 'Umrala'],
  Jamnagar: ['Dhrol', 'Jamnagar', 'Jodiya', 'Jodia', 'Kalavad', 'Lalpur'],
  Gandhinagar: ['Dehgam', 'Gandhinagar', 'Kalol', 'Mansa'],
  Junagadh: ['Junagadh', 'Keshod', 'Mangrol', 'Mendarda', 'Talala', 'Vanthali', 'Veraval', 'Visavadar'],
  Anand: ['Anand', 'Anklav', 'Borsad', 'Khambhat', 'Petlad', 'Sojitra', 'Umreth'],
  Kutch: ['Abdasa', 'Anjar', 'Bhachau', 'Bhuj', 'Gandhidham', 'Lakhpat', 'Mandvi', 'Mundra', 'Nakhatrana', 'Rapar'],
  Mehsana: ['Becharaji', 'Jotana', 'Kadi', 'Mahesana', 'Satlasana', 'Unjha', 'Vijapur', 'Visnagar'],
  Patan: ['Chanasma', 'Harij', 'Patan', 'Radhanpur', 'Sami', 'Santalpur', 'Sidhpur'],

  // ─── Haryana ──────────────────────────────────────────────────────────────
  Gurugram: ['Farukhnagar', 'Gurugram', 'Manesar', 'Pataudi', 'Sohna'],
  Faridabad: ['Ballabhgarh', 'Faridabad'],
  Panipat: ['Israna', 'Panipat', 'Samalkha'],
  Ambala: ['Ambala', 'Ambala Sadar', 'Barara', 'Naraingarh', 'Shehzadpur'],
  Hisar: ['Adampur', 'Agroha', 'Barwala', 'Hansi', 'Hisar', 'Narnaund', 'Uklana'],
  Karnal: ['Assandh', 'Gharaunda', 'Indri', 'Karnal', 'Nilokheri'],
  Rohtak: ['Asthal Bohar', 'Kalanaur', 'Lakhan Majra', 'Maham', 'Rohtak', 'Sanghi'],

  // ─── Himachal Pradesh ─────────────────────────────────────────────────────
  Shimla: ['Chaupal', 'Chopal', 'Jubbal', 'Rampur', 'Shimla', 'Theog'],
  Kangra: ['Baijnath', 'Baroh', 'Dharamshala', 'Kangra', 'Nurpur', 'Palampur'],
  Kullu: ['Ani', 'Banjar', 'Kullu', 'Manali', 'Nirmand'],
  Mandi: ['Balh', 'Chachyot', 'Gohar', 'Jogindernagar', 'Mandi', 'Sadar', 'Thunag'],
  Solan: ['Arki', 'Baddi', 'Dharampur', 'Kasauli', 'Nalagarh', 'Solan'],
  Chamba: ['Bhalai', 'Bharmour', 'Chamba', 'Dalhousie', 'Holi', 'Pangi', 'Saluni', 'Tissa'],

  // ─── Jharkhand ────────────────────────────────────────────────────────────
  Ranchi: ['Angara', 'Bundu', 'Kanke', 'Khelari', 'Mandar', 'Namkum', 'Ormanjhi', 'Ratu', 'Silli', 'Tamar'],
  Jamshedpur: ['Boram', 'Dhalbhum', 'Jugsalai', 'Potka'],
  Dhanbad: ['Baliapur', 'Baghmara', 'Dhanbad', 'Jharia', 'Topchanchi'],
  Bokaro: ['Bokaro', 'Chas', 'Chanda', 'Chandankiyari', 'Nawadih', 'Petarbar'],
  Deoghar: ['Deoghar', 'Madhupur', 'Mohanpur', 'Palajori', 'Sarwan', 'Sarth'],

  // ─── Karnataka ────────────────────────────────────────────────────────────
  'Bengaluru Urban': ['Anekal', 'Bengaluru East', 'Bengaluru North', 'Bengaluru South', 'Bengaluru West', 'Dasarahalli', 'Yelahanka'],
  'Bengaluru Rural': ['Devanahalli', 'Doddaballapura', 'Hosakote', 'Nelamangala'],
  Mysuru: ['Hunsur', 'K R Nagar', 'Mysuru', 'Nanjangud', 'Periyapatna', 'T Narasipur'],
  'Belagavi (Belgaum)': ['Athani', 'Bailhongal', 'Belagavi', 'Chikkodi', 'Gokak', 'Hukkeri', 'Khanapur', 'Raibag', 'Ramdurg', 'Savadatti', 'Soundatti'],
  Dharwad: ['Dharwad', 'Hubballi', 'Kalghatgi', 'Navalgund', 'Kundgol'],
  'Shivamogga (Shimoga)': ['Bhadravati', 'Hosanagara', 'Sagar', 'Shikaripur', 'Shivamogga', 'Soraba', 'Thirthahalli'],
  Tumakuru: ['Chikkanayakanahalli', 'Gubbi', 'Koratagere', 'Madhugiri', 'Pavagada', 'Sira', 'Tiptur', 'Tumakuru', 'Turuvekere'],
  Udupi: ['Karkala', 'Kundapur', 'Udupi'],
  'Dakshina Kannada': ['Bantval', 'Belthangady', 'Mangaluru', 'Moodabidri', 'Puttur', 'Sullia'],
  Mandya: ['K R Pet', 'Maddur', 'Mandya', 'Malavalli', 'Nagamangala', 'Pandavapura', 'Shrirangapattana'],
  Hassan: ['Alur', 'Arkalgud', 'Arsikere', 'Belur', 'Channarayapatna', 'Hassan', 'Holenarasipura', 'Sakleshpur'],

  // ─── Kerala ───────────────────────────────────────────────────────────────
  Thiruvananthapuram: ['Chirayinkeezhu', 'Kattakada', 'Neyyattinkara', 'Thiruvananthapuram', 'Varkala'],
  Ernakulam: ['Aluva', 'Ernakulam', 'Kanayannur', 'Kochi', 'Kothamangalam', 'Muvattupuzha', 'Paravur'],
  Kozhikode: ['Koyilandy', 'Kozhikode', 'Mukkam', 'Perambra', 'Vadakara'],
  Thrissur: ['Chalakudy', 'Kodungallur', 'Mukundapuram', 'Thrissur'],
  Kollam: ['Chavara', 'Karunagappally', 'Kollam', 'Kunnathur', 'Pathanapuram', 'Punalur'],
  Kannur: ['Iritty', 'Kannur', 'Payyannur', 'Taliparamba'],
  Alappuzha: ['Alappuzha', 'Ambalappuzha', 'Chengannur', 'Kuttanad', 'Mavelikkara'],
  Palakkad: ['Alathur', 'Chittur', 'Mannarkkad', 'Ottapalam', 'Palakkad'],
  Malappuram: ['Kondotty', 'Malappuram', 'Nilambur', 'Ponnani', 'Tirur', 'Tirurrangadi'],
  Idukki: ['Devikulam', 'Idukki', 'Peerumade', 'Thodupuzha', 'Udumbanchola'],
  Wayanad: ['Kalpetta', 'Mananthavady', 'Sulthan Bathery'],
  Kottayam: ['Changanacherry', 'Kanjirappally', 'Kottayam', 'Meenachil', 'Vaikom'],
  Pathanamthitta: ['Adoor', 'Kozhencherry', 'Pathanamthitta', 'Ranni', 'Tiruvalla'],
  Kasaragod: ['Hosdurg', 'Kasaragod', 'Vellarikundu'],

  // ─── Madhya Pradesh ───────────────────────────────────────────────────────
  Bhopal: ['Berasia', 'Bhopal', 'Phanda'],
  Indore: ['Depalpur', 'Indore', 'Mhow', 'Sanwer'],
  Gwalior: ['Bhitarwar', 'Dabra', 'Gwalior', 'Morar'],
  Jabalpur: ['Jabalpur', 'Kundam', 'Patan', 'Sihora'],
  Ujjain: ['Barnagar', 'Ghattia', 'Khachrod', 'Mahidpur', 'Tarana', 'Ujjain'],
  Sagar: ['Banda', 'Bina', 'Deori', 'Khurai', 'Rahatgarh', 'Rehli', 'Sagar'],
  Rewa: ['Gurh', 'Hanumana', 'Mauganj', 'Rewa', 'Sirmour', 'Teonthar', 'Tyonthar'],
  Satna: ['Amarpatan', 'Maihar', 'Nagod', 'Rampur Baghelan', 'Satna', 'Unchehara'],

  // ─── Maharashtra ──────────────────────────────────────────────────────────
  Pune: ['Ambegaon', 'Baramati', 'Bhor', 'Daund', 'Haveli', 'Indapur', 'Junnar', 'Khed', 'Maval', 'Mulshi', 'Purandar', 'Shirur', 'Velhe'],
  'Mumbai City': ['Kurla', 'Borivali', 'Andheri', 'Bandra', 'Colaba', 'Fort', 'Sion', 'Vikhroli', 'Worli'],
  'Mumbai Suburban': ['Andheri', 'Borivali', 'Kurla', 'Mulund', 'Vile Parle'],
  Nashik: ['Baglan', 'Chandwad', 'Deola', 'Dindori', 'Igatpuri', 'Kalwan', 'Malegaon', 'Nandgaon', 'Nashik', 'Niphad', 'Peint', 'Sinnar', 'Surgana', 'Trimbakeshwar', 'Yeola'],
  Nagpur: ['Bhiwapur', 'Hingna', 'Kamptee', 'Katol', 'Kuhi', 'Mauda', 'Nagpur City', 'Nagpur Rural', 'Narkhed', 'Parseoni', 'Ramtek', 'Savner', 'Umred'],
  Kolhapur: ['Ajra', 'Bhudargad', 'Chandgad', 'Gadhinglaj', 'Hatkanangle', 'Kagal', 'Karveer', 'Panhala', 'Radhanagari', 'Shahuwadi', 'Shirol'],
  Satara: ['Jawali', 'Karad', 'Khandala', 'Khatav', 'Koregaon', 'Mahabaleshwar', 'Man', 'Patan', 'Phaltan', 'Satara', 'Wai'],
  Sangli: ['Atpadi', 'Jat', 'Kadegaon', 'Kavathemahankal', 'Khanapur', 'Miraj', 'Palus', 'Shirala', 'Tasgaon', 'Walwa'],
  Solapur: ['Akkalkot', 'Barshi', 'Karmala', 'Madha', 'Malshiras', 'Mangalvedhe', 'Mohol', 'Pandharpur', 'Sangola', 'Solapur North', 'Solapur South'],
  Ahmednagar: ['Ahmednagar', 'Akole', 'Jamkhed', 'Karjat', 'Kopargaon', 'Nevasa', 'Parner', 'Pathardi', 'Rahata', 'Rahuri', 'Sangamner', 'Shevgaon', 'Shrigonda', 'Shrirampur'],
  Aurangabad: ['Aurangabad', 'Gangapur', 'Kannad', 'Khuldabad', 'Paithan', 'Phulambri', 'Sillod', 'Soegaon', 'Vaijapur'],
  Latur: ['Ahmadpur', 'Ausa', 'Chakur', 'Deoni', 'Jalkot', 'Latur', 'Nilanga', 'Renapur', 'Shirur-Anantpal', 'Udgir'],
  Nanded: ['Ardhapur', 'Biloli', 'Bhokar', 'Deglur', 'Dharmabad', 'Hadgaon', 'Himayatnagar', 'Kandhar', 'Kinwat', 'Loha', 'Mahur', 'Mudkhed', 'Mukhed', 'Naigaon', 'Nanded', 'Umri'],
  Thane: ['Ambernath', 'Bhiwandi', 'Kalyan', 'Murbad', 'Shahapur', 'Thane', 'Ulhasnagar'],
  Jalgaon: ['Amalner', 'Bhadgaon', 'Bhusawal', 'Bodwad', 'Chalisgaon', 'Chopda', 'Dharangaon', 'Erandol', 'Jalgaon', 'Jamner', 'Muktainagar', 'Pachora', 'Parola', 'Raver', 'Yawal'],
  Ratnagiri: ['Chiplun', 'Dapoli', 'Guhagar', 'Khed', 'Lanja', 'Mandangad', 'Rajapur', 'Ratnagiri', 'Sangameshwar'],
  Sindhudurg: ['Devgad', 'Dodamarg', 'Kankavli', 'Kudal', 'Malvan', 'Sawantwadi', 'Vaibhavwadi', 'Vengurla'],
  Wardha: ['Arvi', 'Ashti', 'Deoli', 'Hinganghat', 'Karanja', 'Seloo', 'Sindhi', 'Wardha'],
  Chandrapur: ['Bhadravati', 'Ballarpur', 'Brahmapuri', 'Chandrapur', 'Chimur', 'Gondpipri', 'Jiwati', 'Mul', 'Nagbhid', 'Pombhurna', 'Rajura', 'Sawali', 'Sindewahi', 'Warora'],
  Akola: ['Akola', 'Akot', 'Balapur', 'Barshitakli', 'Murtijapur', 'Patur', 'Telhara'],
  Yavatmal: ['Arni', 'Babulgaon', 'Darwha', 'Digras', 'Ghatanji', 'Kalamb', 'Kelapur', 'Mahagaon', 'Maregaon', 'Ner', 'Pushp', 'Ralegaon', 'Umarkhed', 'Wani', 'Yavatmal', 'Zari-Jamni'],
  Beed: ['Ambejogai', 'Ashti', 'Beed', 'Georai', 'Kaij', 'Manjlegaon', 'Parli', 'Patoda', 'Shirur (Kasar)', 'Wadwani'],
  'Osmanabad (Dharashiv)': ['Kalamb', 'Lohara', 'Osmanabad', 'Paranda', 'Tuljapur', 'Umarga', 'Omerga', 'Washi'],
  Palghar: ['Dahanu', 'Jawhar', 'Mokhada', 'Palghar', 'Talasari', 'Vasai', 'Vikramgad', 'Wada'],
  Raigad: ['Alibag', 'Karjat', 'Khalapur', 'Mahad', 'Mangaon', 'Mhasla', 'Murud', 'Panvel', 'Pen', 'Poladpur', 'Roha', 'Shrivardhan', 'Sudhagad', 'Tala', 'Uran'],
  Gondia: ['Amgaon', 'Arjuni Morgaon', 'Deori', 'Gondiya', 'Goregaon', 'Salekasa', 'Sadak-Arjuni', 'Tirora'],
  Bhandara: ['Bhandara', 'Lakhandur', 'Lakhani', 'Mohadi', 'Pauni', 'Sakoli', 'Tumsar'],
  Buldhana: ['Buldana', 'Chikhali', 'Deulgaon Raja', 'Jalgaon Jamod', 'Khamgaon', 'Lonar', 'Malkapur', 'Mehkar', 'Motala', 'Nandura', 'Sangrampur', 'Shegaon', 'Sindkhed Raja'],
  Amravati: ['Achalpur', 'Amravati', 'Anjangaon Surji', 'Bhatkuli', 'Chandur Bazar', 'Chandur Railway', 'Chikhaldara', 'Daryapur', 'Dhamangaon Railway', 'Morshi', 'Nandgaon Khandeshwar', 'Tiosa', 'Warud'],
  Dhule: ['Dhule', 'Sakri', 'Shirpur', 'Sindkhede'],
  Nandurbar: ['Akkalkuwa', 'Akrani', 'Nandurbar', 'Navapur', 'Shahada', 'Taloda'],
  Parbhani: ['Gangakhed', 'Jintur', 'Manwath', 'Palam', 'Parbhani', 'Pathri', 'Purna', 'Sailu', 'Selu'],
  Hingoli: ['Aundha Nagnath', 'Basmath', 'Hingoli', 'Kalamnuri', 'Sengaon'],
  Jalna: ['Ambad', 'Badnapur', 'Bhokardan', 'Ghansawangi', 'Jafferabad', 'Jalna', 'Mantha', 'Partur'],
  Washim: ['Karanja', 'Malegaon', 'Mangrulpir', 'Manora', 'Risod', 'Washim'],
  Gadchiroli: ['Aheri', 'Armori', 'Bhamragad', 'Chamori', 'Chamorshi', 'Dhanora', 'Etapalli', 'Gadchiroli', 'Korchi', 'Kurkheda', 'Mulchera', 'Sironcha', 'Wadsa'],
  Palghar2: ['Dahanu', 'Jawhar', 'Mokhada', 'Palghar', 'Talasari', 'Vasai', 'Vikramgad', 'Wada'],

  // ─── Punjab ───────────────────────────────────────────────────────────────
  Amritsar: ['Ajnala', 'Amritsar-1', 'Amritsar-2', 'Baba Bakala', 'Majitha', 'Rayya', 'Tarsikka'],
  Ludhiana: ['Dehlon', 'Jagraon', 'Khanna', 'Ludhiana East', 'Ludhiana West', 'Raikot', 'Samrala'],
  Jalandhar: ['Jalandhar East', 'Jalandhar West', 'Nakodar', 'Phagwara', 'Shahkot'],
  Patiala: ['Nabha', 'Patiala', 'Rajpura', 'Samana'],
  Bathinda: ['Bathinda', 'Maur Mandi', 'Phul', 'Rampura Phul', 'Sangat', 'Talwandi Sabo'],

  // ─── Rajasthan ────────────────────────────────────────────────────────────
  Jaipur: ['Amber', 'Bassi', 'Chaksu', 'Dudu', 'Jaipur', 'Jamwa Ramgarh', 'Kotputli', 'Phagi', 'Sanganer', 'Shahpura', 'Viratnagar'],
  Jodhpur: ['Bhopalgarh', 'Bilara', 'Jodhpur', 'Lohawat', 'Mandore', 'Osian', 'Phalodi', 'Shergarh', 'Tinwari'],
  Udaipur: ['Girwa', 'Gogunda', 'Jhadol', 'Kherwara', 'Kotra', 'Lasadiya', 'Mavli', 'Rishabhdeo', 'Sarada', 'Salumber', 'Semari', 'Udaipur', 'Vallabhanagar'],
  Kota: ['Itawa', 'Kanwas', 'Kota North', 'Kota South', 'Ladpura', 'Pipalda', 'Ramganjmandi', 'Sangod'],
  Ajmer: ['Ajmer', 'Beawar', 'Bhinai', 'Jawaja', 'Kekri', 'Masuda', 'Nasirabad', 'Pisangan', 'Pushkar', 'Roopangarh', 'Sawar', 'Srinagar'],
  Bikaner: ['Bikaner', 'Chhatargarh', 'Dungargarh', 'Kolayat', 'Lunkaransar', 'Nokha', 'Poogal', 'Shri Dungargarh'],
  Alwar: ['Alwar', 'Bansur', 'Bahror', 'Kathumar', 'Kishangarh Bas', 'Kotkasim', 'Laxmangarh', 'Mundawar', 'Neemrana', 'Rajgarh', 'Ramgarh', 'Thanagazi', 'Tijara'],
  Bharatpur: ['Bharatpur', 'Deeg', 'Kaman', 'Kumher', 'Nagar', 'Nadbai', 'Pahari', 'Roopbas', 'Sewar', 'Sikrai', 'Vair', 'Weir'],

  // ─── Tamil Nadu ───────────────────────────────────────────────────────────
  Chennai: ['Alandur', 'Ambattur', 'Avadi', 'Chennai', 'Perambur', 'Sholinganallur', 'Tambaram', 'Thiruvottiyur', 'Tondiarpet'],
  Coimbatore: ['Annur', 'Coimbatore North', 'Coimbatore South', 'Kinathukadavu', 'Madukkarai', 'Mettupalayam', 'Perur', 'Pollachi', 'Sultanpet', 'Valparai'],
  Madurai: ['Kallikudi', 'Kottampatti', 'Madurai East', 'Madurai North', 'Madurai South', 'Madurai West', 'Melur', 'Peraiyur', 'Thirumangalam', 'Usilampatti', 'Vadipatti'],
  Tiruchirappalli: ['Lalgudi', 'Manachanallur', 'Manapparai', 'Marungapuri', 'Musiri', 'Srirangam', 'Thottiyam', 'Thuraiyur', 'Tiruchirappalli', 'Uppiliyapuram'],
  Salem: ['Attur', 'Edapadi', 'Gangavalli', 'Kadayampatti', 'Kannankurichi', 'Mettur', 'Omalur', 'Pethanaickenpalayam', 'Salem', 'Sangagiri', 'Valapady', 'Veerapandi', 'Yercaud'],
  Tirunelveli: ['Ambasamudram', 'Cheranmahadevi', 'Manur', 'Nanguneri', 'Palayamkottai', 'Radhapuram', 'Tenkasi', 'Tirunelveli', 'Veerakeralamputhur'],
  Vellore: ['Anaicut', 'Gudiyatham', 'Jolarpet', 'Katpadi', 'Pernambut', 'Tirupathur', 'Vaniyambadi', 'Vellore', 'Walajah'],
  Erode: ['Anthiyur', 'Bhavani', 'Chennimalai', 'Erode', 'Gobichettipalayam', 'Kodumudi', 'Modakkurichi', 'Nambiyur', 'Perundurai', 'Sathyamangalam', 'Thalavadi'],

  // ─── Telangana ────────────────────────────────────────────────────────────
  Hyderabad: ['Charminar', 'Khairatabad', 'Musheerabad', 'Nampally', 'Secunderabad', 'Serilingampally'],
  Warangal: ['Bhupalapally', 'Eturnagaram', 'Govindaraopet', 'Mulug', 'Parkal', 'Shayampet', 'Warangal East', 'Warangal West'],
  Nizamabad: ['Armoor', 'Balkonda', 'Banswada', 'Bodhan', 'Kamareddy', 'Madnoor', 'Nizamabad', 'Nizamsagar', 'Varni', 'Yellareddy'],
  Karimnagar: ['Choppadandi', 'Huzurabad', 'Jagitial', 'Jagtial', 'Karimnagar', 'Manthani', 'Peddapalli', 'Ramagundam', 'Sultanabad'],
  Khammam: ['Aswaraopeta', 'Bhadrachalam', 'Burgampadu', 'Kallur', 'Khammam', 'Kothagudem', 'Madhira', 'Sathupalle', 'Wyra'],

  // ─── Uttar Pradesh ────────────────────────────────────────────────────────
  Lucknow: ['Bakshi Ka Talab', 'Chinhat', 'Lucknow East', 'Lucknow North', 'Lucknow South', 'Lucknow West', 'Mal', 'Mohanlalganj', 'Sarojininagar'],
  Agra: ['Agra', 'Bah', 'Barauli Ahir', 'Etmadpur', 'Fatehabad', 'Fatehpur Sikri', 'Jagner', 'Khandauli', 'Kheragarh', 'Pinahat', 'Saiyan'],
  Varanasi: ['Arajiline', 'Cholapur', 'Harhua', 'Kashi Vidyapeeth', 'Pindra', 'Rajatalab', 'Sewapuri', 'Varanasi'],
  Prayagraj: ['Allahabad North', 'Allahabad South', 'Allahabad West', 'Bara', 'Chaka', 'Handia', 'Jasra', 'Karchhana', 'Kaurihar', 'Koraon', 'Mauaima', 'Meja', 'Phulpur', 'Pratappur', 'Shankargarh', 'Soraon'],
  Meerut: ['Hapur', 'Kharkhoda', 'Loni', 'Meerut', 'Meerut Cantonment', 'Modi Nagar', 'Modinagar', 'Sardhana'],
  Kanpur: ['Armapur', 'Bilhaur', 'Ghatampur', 'Kanpur City', 'Kanpur Rural', 'Patara'],
  Gorakhpur: ['Bansgaon', 'Campierganj', 'Chauri Chaura', 'Gola', 'Gorakhpur', 'Khajni', 'Pipraich', 'Sahjanwa'],
  Mathura: ['Chhata', 'Farah', 'Goverdhan', 'Mathura', 'Mant', 'Nandgaon'],
  Bareilly: ['Aonla', 'Baheri', 'Bareilly', 'Faridpur', 'Mirganj', 'Nawabganj', 'Richha'],
  Ayodhya: ['Ayodhya', 'Bikapur', 'Haveli', 'Milkipur', 'Pura Kalyanpur', 'Rudauli', 'Sohawal'],
  Noida: ['Dadri', 'Jewar', 'Noida'],
  Ghaziabad: ['Ghaziabad', 'Hapur', 'Loni', 'Modinagar', 'Muradnagar'],

  // ─── Uttarakhand ──────────────────────────────────────────────────────────
  Dehradun: ['Chakrata', 'Dehradun', 'Doiwala', 'Rishikesh', 'Sahaspur', 'Tuni (Thano)', 'Vikasnagar'],
  Haridwar: ['Bahadrabad', 'Bhagwanpur', 'Haridwar', 'Jwalapur', 'Khanpur', 'Laksar', 'Narsan', 'Roorkee'],
  Nainital: ['Betalghat', 'Bhimtal', 'Dhari', 'Haldwani', 'Kotyara', 'Nainital', 'Okhalkanda', 'Ramnagar'],
  'Pauri Garhwal': ['Bironkhal', 'Dwarikhal', 'Idwal', 'Kot', 'Lansdowne', 'Pauri', 'Pabo', 'Rikhnikhal', 'Thalisain', 'Yamkeshwar'],
  Almora: ['Almora', 'Bhainta', 'Bhikiasen', 'Chaukhutia', 'Dwarahat', 'Hawalbagh', 'Jainti', 'Lamgara', 'Salt', 'Sult', 'Syaldeh', 'Tarikhet'],

  // ─── West Bengal ──────────────────────────────────────────────────────────
  Kolkata: ['Kolkata'],
  Howrah: ['Bally-Jagachha', 'Domjur', 'Howrah', 'Jagatballavpur', 'Panchla', 'Sankrail', 'Uluberia-I', 'Uluberia-II'],
  Darjeeling: ['Darjeeling', 'Jorebunglow Sukiapokhri', 'Kalimpong', 'Kurseong', 'Mirik', 'Siliguri'],
  Siliguri: ['Matigara', 'Naxalbari', 'Phansidewa', 'Rajganj', 'Siliguri'],
  Durgapur: ['Andal', 'Ausgram-I', 'Ausgram-II', 'Durgapur Faridpur', 'Galsi-I', 'Galsi-II', 'Kanksa', 'Memari-I', 'Memari-II'],
  Murshidabad: ['Beldanga-I', 'Beldanga-II', 'Bhagawangola-I', 'Bhagawangola-II', 'Burwan', 'Domkal', 'Farakka', 'Hariharpara', 'Jalangi', 'Jiaganj', 'Kandi', 'Khargram', 'Lalgola', 'Murshidabad-Jiaganj', 'Nabagram', 'Raninagar-I', 'Raninagar-II', 'Raghunathganj-I', 'Raghunathganj-II', 'Suti-I', 'Suti-II'],

  // ─── Delhi ────────────────────────────────────────────────────────────────
  'Central Delhi': ['Daryaganj', 'Karol Bagh', 'Paharganj'],
  'East Delhi': ['Gandhi Nagar', 'Preet Vihar', 'Shahdara', 'Vivek Vihar'],
  'New Delhi': ['New Delhi', 'Sarojini Nagar'],
  'North Delhi': ['Alipur', 'Civil Lines', 'Kotwali', 'Model Town', 'Narela', 'Sadar Bazar'],
  'North East Delhi': ['Gokulpuri', 'Jaffrabad', 'Mustafabad', 'Seelam Pur'],
  'North West Delhi': ['Bawana', 'Kanjhawala', 'Mangolpuri', 'Rohini', 'Shalimar Bagh'],
  'South Delhi': ['Defence Colony', 'Greater Kailash', 'Hauz Khas', 'Malviya Nagar', 'Mehrauli', 'Saket'],
  'South East Delhi': ['Lajpat Nagar', 'Okhla', 'Tughlakabad'],
  'South West Delhi': ['Dwarka', 'Kapashera', 'Najafgarh', 'Palam', 'Vasant Vihar'],
  'West Delhi': ['Janakpuri', 'Moti Nagar', 'Rajouri Garden', 'Tagore Garden', 'Tilak Nagar', 'Uttam Nagar'],
  Shahdara: ['Dayalpur', 'Gandhi Nagar', 'Seelampur', 'Shahdara', 'Vivek Vihar'],

  // ─── Jammu & Kashmir ──────────────────────────────────────────────────────
  Srinagar: ['Central', 'Channapora', 'Eidgah', 'Hazratbal', 'Khanyar', 'Shalteng', 'Zadibal'],
  Jammu: ['Akhnoor', 'Bishnah', 'Jammu', 'Nagrota', 'R S Pura', 'Suchetgarh'],
  Baramulla: ['Baramulla', 'Boniyar', 'Pattan', 'Rafiabad', 'Sopore', 'Tangmarg', 'Uri', 'Wagoora'],
  Anantnag: ['Anantnag', 'Bijbehara', 'Breng', 'Dooru', 'Shangus', 'Srigufwara'],

  // ─── Ladakh ───────────────────────────────────────────────────────────────
  Leh: ['Chushul', 'Durbuk', 'Leh', 'Nubra', 'Nyoma', 'Saspol', 'Skurbuchan'],
  Kargil: ['Drass', 'Kargil', 'Sankoo', 'Shakar Chiktan', 'Zanskar'],

  // ─── Puducherry ───────────────────────────────────────────────────────────
  Puducherry: ['Ariyankuppam', 'Bahour', 'Mannadipet', 'Nettapakkam', 'Puducherry', 'Villianur'],
  Karaikal: ['Karaikal', 'Karaikal North', 'Karaikal South', 'Neravy', 'Thirunallar'],
  Mahe: ['Mahe'],
  Yanam: ['Yanam'],

  // ─── Chandigarh ───────────────────────────────────────────────────────────
  Chandigarh: ['Chandigarh'],

  // ─── Lakshadweep ──────────────────────────────────────────────────────────
  Lakshadweep: ['Amini', 'Androth', 'Arngath', 'Chetlat', 'Kadmat', 'Kalpeni', 'Kavaratti', 'Kiltan', 'Minicoy', 'North Ari'],

  // ─── Andaman & Nicobar Islands ────────────────────────────────────────────
  'South Andaman': ['Ferrargunj', 'Port Blair', 'Tushnabad'],
  'North and Middle Andaman': ['Diglipur', 'Mayabunder', 'Rangat'],
  Nicobar: ['Car Nicobar', 'Nancowry'],

  // ─── Dadra & Nagar Haveli and Daman & Diu ─────────────────────────────────
  'Dadra and Nagar Haveli': ['Dadra', 'Nagar Haveli', 'Silvassa'],
  Daman: ['Daman', 'Daman City'],
  Diu: ['Diu'],

  // ─── Goa ──────────────────────────────────────────────────────────────────
  'North Goa2': ['Bardez', 'Bicholim', 'Pernem', 'Ponda', 'Satari', 'Tiswadi'],
  'South Goa2': ['Canacona', 'Dharbandora', 'Mormugao', 'Quepem', 'Salcete', 'Sanguem'],
};

export default TALUKAS_BY_DISTRICT;
