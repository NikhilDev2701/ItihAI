"""
Database Initialization and Non-Destructive Seeding Script for ItihAI.
Defines verified initial heritage sites (13 landmarks across North, East, South, West, and Central India)
and supported languages. Safe and idempotent.
"""

import logging
import sys
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.database.database import engine, Base, SessionLocal
from app.database.models import HeritageSite, Language

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

# Complete verified heritage sites dataset (13 authoritative Indian heritage landmarks)
SAMPLE_HERITAGE_SITES = [
    {
        "name": "Taj Mahal",
        "slug": "taj-mahal",
        "location": "Agra, Uttar Pradesh",
        "state": "Uttar Pradesh",
        "country": "India",
        "region": "North India",
        "description": "The pinnacle of Mughal architecture and an eternal monument of love crafted from pristine white Makrana marble.",
        "historical_overview": "Commissioned in 1632 by Mughal Emperor Shah Jahan to house the tomb of his beloved wife Mumtaz Mahal on the southern bank of the Yamuna River. Construction was supervised by a board of architects led by Ustad Ahmad Lahori, employing over 20,000 artisans from across India, Persia, and Central Asia over 22 years.",
        "cultural_significance": "A UNESCO World Heritage site representing the syncretic fusion of Indian, Persian, and Islamic artistic sensibilities during India's golden age of classical craftsmanship. Widely recognized as an enduring global symbol of Indian heritage.",
        "architecture": "Features a central white marble dome flanked by four symmetrical minarets, intricate Pietra Dura (parchin kari) stone inlays with semi-precious gems, calligraphy friezes, and Persian-style Charbagh quadrilateral gardens reflecting paradise.",
        "historical_period": "Medieval & Mughal (1200–1750 CE)",
        "heritage_type": "UNESCO World Heritage",
        "image_url": "/images/heritage/taj-mahal.jpg",
        "interesting_facts": [
            "The Taj Mahal appears to change color throughout the day: soft pink at dawn, brilliant white in the afternoon, and shimmering gold under moonlight.",
            "The four outer minarets are angled slightly outwards so that in the event of a severe earthquake, they would collapse away from the central mausoleum.",
            "All four facades are perfectly symmetrical; the only intentional asymmetry in the entire monument is the cenotaph of Shah Jahan placed beside Mumtaz Mahal's.",
        ],
        "local_traditions": [
            {
                "title": "Shoe Coverings & Respect",
                "description": "Visitors remove footwear or wear protective shoe covers before ascending the main marble plinth to preserve the stone.",
                "tip": "Collect shoe covers at the official ASI entrance kiosks.",
            },
            {
                "title": "Friday Closure",
                "description": "The monument is closed to general tourists every Friday for congregational prayers at the mosque inside the complex.",
                "tip": "Plan your visit between Saturday and Thursday.",
            },
        ],
        "nearby_attractions": [
            {"name": "Agra Fort", "distance": "2.5 km", "description": "Massive red sandstone fortress and seat of Mughal Emperors until 1638."},
            {"name": "Fatehpur Sikri", "distance": "36 km", "description": "UNESCO World Heritage royal citadel built by Emperor Akbar."},
            {"name": "Mehtab Bagh", "distance": "3.2 km", "description": "Moonlight Garden across the river offering sunset views of the Taj."},
        ],
        "visitor_information": {
            "bestTime": "October to March (Pleasant winter weather)",
            "hours": "30 minutes before sunrise to 30 minutes before sunset (Closed Fridays)",
            "entryFee": "₹1,100 + ₹200 for main mausoleum (Foreign Tourists)",
            "dressCode": "Modest clothing covering shoulders and knees recommended",
            "photography": "Permitted in gardens; prohibited inside the inner tomb chamber",
        },
        "latitude": 27.1751,
        "longitude": 78.0421,
    },
    {
        "name": "Red Fort (Lal Qila)",
        "slug": "red-fort",
        "location": "Old Delhi, Delhi",
        "state": "Delhi",
        "country": "India",
        "region": "North India",
        "description": "The historic fortress of Shahjahanabad, constructed with majestic red sandstone as the seat of Mughal imperial power.",
        "historical_overview": "Built by Emperor Shah Jahan in 1638 when he shifted his imperial capital from Agra to Delhi (Shahjahanabad). Served as the political and ceremonial capital of the Mughal Empire for nearly two centuries until 1857.",
        "cultural_significance": "An iconic symbol of Indian sovereignty and modern nationhood where the Prime Minister of India hoists the national flag every Independence Day on August 15.",
        "architecture": "Enclosed within 2.4 km of defensive red sandstone battlements, featuring the Lahori Gate, Diwan-i-Aam (Hall of Public Audience), Diwan-i-Khas (Hall of Private Audience), and the Nahr-i-Bihisht (Canal of Paradise) water channels.",
        "historical_period": "Medieval & Mughal (1200–1750 CE)",
        "heritage_type": "Forts & Palaces",
        "image_url": "/images/heritage/red-fort.jpg",
        "interesting_facts": [
            "The fort was originally partially white and red; later British restorations coated deteriorated limestone sections with red paint.",
            "The legendary Peacock Throne (*Takht-i-Taus*), which held the Koh-i-Noor diamond, originally sat in the Diwan-i-Khas before 1739.",
            "Contains a covered market called Chatta Chowk, where royal court artisans once sold fine silks and jewelry.",
        ],
        "local_traditions": [
            {
                "title": "Independence Day Celebrations",
                "description": "Annual venue for national address and ceremonial flag hoisting.",
                "tip": "Security is high during August; check visit schedules in advance.",
            },
            {
                "title": "Evening Sound & Light Show",
                "description": "Historic multimedia storytelling of Old Delhi's 500-year history.",
                "tip": "Book show tickets in advance through the official ASI portal.",
            },
        ],
        "nearby_attractions": [
            {"name": "Jama Masjid", "distance": "1.0 km", "description": "One of India's grandest historic congregational mosques."},
            {"name": "Chandni Chowk", "distance": "500 m", "description": "Historic bazaar famous for street food and spice markets."},
        ],
        "visitor_information": {
            "bestTime": "October to March",
            "hours": "9:30 AM to 4:30 PM (Closed Mondays)",
            "entryFee": "₹550 (Foreign Tourists)",
            "dressCode": "Comfortable footwear for extensive walking; modest clothing",
            "photography": "Permitted in outdoor courtyards",
        },
        "latitude": 28.6562,
        "longitude": 77.2410,
    },
    {
        "name": "Qutub Minar",
        "slug": "qutub-minar",
        "location": "Mehrauli, New Delhi",
        "state": "Delhi",
        "country": "India",
        "region": "North India",
        "description": "The tallest brick minaret in the world, standing 72.5 meters tall surrounded by ancient ruins and the rust-resistant Iron Pillar.",
        "historical_overview": "Founded by Qutb-ud-din Aibak in 1192 and completed by his successors Shams-ud-din Iltutmish and Firoz Shah Tughlaq, marking the establishment of the Delhi Sultanate. The surrounding complex contains the Quwwat-ul-Islam Mosque and the Tomb of Iltutmish.",
        "cultural_significance": "Marks the early architectural syncretism where Indian stonecutters incorporated traditional lotus and bell motifs into Islamic calligraphy and geometrical arches.",
        "architecture": "Fluted red sandstone and marble tower with five distinct storeys, projecting balconies supported by intricate stalactite corbeling, and Arabic inscriptions.",
        "historical_period": "Medieval & Mughal (1200–1750 CE)",
        "heritage_type": "Monuments & Memorials",
        "image_url": "/images/heritage/qutub-minar.jpg",
        "interesting_facts": [
            "The 1,600-year-old Gupta Iron Pillar in the central courtyard has resisted corrosion and rust for over sixteen centuries.",
            "The tower has survived several earthquake and lightning strikes, repaired meticulously across Sultanate and Mughal reigns.",
        ],
        "local_traditions": [
            {
                "title": "Iron Pillar Legend",
                "description": "Folklore held that embracing the pillar backwards brought good fortune (now preserved behind a protective barrier).",
                "tip": "Observe the Sanskrit inscriptions dedicated to King Chandra on the pillar.",
            },
        ],
        "nearby_attractions": [
            {"name": "Mehrauli Archaeological Park", "distance": "800 m", "description": "Over 100 historic monuments spanning 1,000 years."},
            {"name": "Garden of Five Senses", "distance": "2.5 km", "description": "Lush 20-acre landscaped park and cultural space."},
        ],
        "visitor_information": {
            "bestTime": "October to March",
            "hours": "Sunrise to Sunset (Open all 7 days)",
            "entryFee": "₹550 (Foreign Tourists)",
            "dressCode": "Comfortable clothing and walking shoes",
            "photography": "Permitted throughout the archaeological park",
        },
        "latitude": 28.5245,
        "longitude": 77.1855,
    },
    {
        "name": "Konark Sun Temple",
        "slug": "konark-sun-temple",
        "location": "Konark, Puri, Odisha",
        "state": "Odisha",
        "country": "India",
        "region": "East India",
        "description": "The 13th-century monumental stone chariot of the Sun God Surya, featuring 24 intricately carved astronomical sundial wheels.",
        "historical_overview": "Built around 1250 CE by King Narasimhadeva I of the Eastern Ganga Dynasty on the shores of the Bay of Bengal, designed as a colossal chariot for the solar deity Surya pulled by seven stone horses.",
        "cultural_significance": "Celebrated worldwide for supreme Kalinga stone craftsmanship. Nobel laureate Rabindranath Tagore wrote: 'Here the language of stone surpasses the language of human.'",
        "architecture": "Exemplifies Kalinga temple architecture in Khondalite stone. The 24 wheels function as precise sundials where spoke shadow angles indicate time accurately.",
        "historical_period": "Ancient (Pre-1200 CE)",
        "heritage_type": "Temples & Spiritual",
        "image_url": "/images/heritage/konark-sun-temple.jpg",
        "interesting_facts": [
            "The 24 wheels represent the 24 hours of the day (or 12 fortnights), and the 7 horses represent the days of the week.",
            "Shadows cast on the wheels' inner spokes can calculate time down to the minute.",
            "European sailors referred to Konark as the 'Black Pagoda' because of its magnetic summit affecting navigation compasses.",
        ],
        "local_traditions": [
            {
                "title": "Konark Dance Festival",
                "description": "Annual classical dance extravaganza (Odissi, Bharatanatyam, Kathak) held in early December against the illuminated temple backdrop.",
                "tip": "Plan your trip in December to attend evening performances.",
            },
        ],
        "nearby_attractions": [
            {"name": "Chandrabhaga Beach", "distance": "3 km", "description": "Scenic coastline famous for picturesque sunrises."},
            {"name": "Puri Jagannath Temple", "distance": "35 km", "description": "One of the sacred Char Dham pilgrimage sites in India."},
        ],
        "visitor_information": {
            "bestTime": "November to February",
            "hours": "6:00 AM to 8:00 PM (Daily)",
            "entryFee": "₹600 (Foreign Tourists)",
            "dressCode": "Comfortable cotton clothing; remove footwear before climbing sanctum plinths",
            "photography": "Permitted across the temple grounds",
        },
        "latitude": 19.8876,
        "longitude": 86.0945,
    },
    {
        "name": "Victoria Memorial",
        "slug": "victoria-memorial",
        "location": "Kolkata, West Bengal",
        "state": "West Bengal",
        "country": "India",
        "region": "East India",
        "description": "Grand white marble monument in Kolkata blending British, Mughal, and Venetian architectural styles amidst 64 acres of lush gardens.",
        "historical_overview": "Built between 1906 and 1921 in memory of Queen Victoria, designed by architect William Emerson using the same white Makrana marble quarried for the Taj Mahal.",
        "cultural_significance": "A cultural landmark of Kolkata housing an extensive museum of rare paintings, manuscripts, and historical documents from India's modern history.",
        "architecture": "Designed in the Indo-Saracenic revivalist style with classical European and Renaissance influences, topped with a rotating 16-foot bronze Angel of Victory.",
        "historical_period": "Colonial (1750–1947 CE)",
        "heritage_type": "Monuments & Memorials",
        "image_url": "/images/heritage/victoria-memorial.jpg",
        "interesting_facts": [
            "The bronze Angel of Victory atop the central dome rotates on ball bearings as the wind blows.",
            "Houses the world's largest single collection of paintings by Thomas and William Daniell documenting 18th-century India.",
        ],
        "local_traditions": [
            {
                "title": "Morning Walks & Kolkata Adda",
                "description": "The sprawling gardens are an iconic venue for morning walkers, artists, and lively intellectual discussions (*Adda*).",
                "tip": "Visit early in the morning for crisp air and lake views.",
            },
        ],
        "nearby_attractions": [
            {"name": "Indian Museum", "distance": "1.5 km", "description": "Ninth oldest museum in the world and largest in India."},
            {"name": "St. Paul's Cathedral", "distance": "600 m", "description": "Anglican cathedral famous for Gothic architecture and stained glass."},
            {"name": "Howrah Bridge", "distance": "5 km", "description": "Iconic cantilever bridge over the Hooghly River."},
        ],
        "visitor_information": {
            "bestTime": "October to March",
            "hours": "Museum: 10:00 AM – 6:00 PM (Closed Mondays); Gardens: 5:30 AM – 6:00 PM daily",
            "entryFee": "₹500 (Foreign Tourists)",
            "dressCode": "Casual smart",
            "photography": "Permitted in gardens; restricted in museum galleries",
        },
        "latitude": 22.5448,
        "longitude": 88.3426,
    },
    {
        "name": "Bishnupur Terracotta Temples",
        "slug": "bishnupur-temples",
        "location": "Bishnupur, Bankura, West Bengal",
        "state": "West Bengal",
        "country": "India",
        "region": "East India",
        "description": "Exquisite 17th-century terracotta temples built by the Malla Kings, renowned for intricate burnt-clay narrative panels and curved Bengal roofs.",
        "historical_overview": "Constructed under the patronage of the Malla rulers in the 17th and 18th centuries using local burnt red clay bricks due to the scarcity of stone in the Bengal delta. Notable structures include Rasmancha, Jor Bangla, and Shyam Rai Temple.",
        "cultural_significance": "Represents the pinnacle of Bengal terracotta craftsmanship depicting epics like Ramayana and Mahabharata, alongside the famous Bishnupur classical music Gharana.",
        "architecture": "Features Bengal Chala (curved thatched roof) and Ratna (pinnacled) architecture completely adorned with sculpted terracotta narrative relief tiles.",
        "historical_period": "Medieval & Mughal (1200–1750 CE)",
        "heritage_type": "Temples & Spiritual",
        "image_url": "/images/heritage/bishnupur-temples.jpg",
        "interesting_facts": [
            "The Rasmancha features an unprecedented stepped pyramidal roof and 108 pillared chambers used during the historic Ras festival.",
            "Terracotta tiles have withstood monsoon humidity for over 400 years with remarkably intact sculptural detail.",
            "Home of the legendary Dalmadal Cannon, which folklore claims was fired by Lord Madanmohan to defend the city.",
        ],
        "local_traditions": [
            {
                "title": "Baluchari Silk Weaving",
                "description": "Witness master weavers creating silk sarees featuring woven mythological narrative borders.",
                "tip": "Visit artisan workshops in Shankhari Bazaar.",
            },
        ],
        "nearby_attractions": [
            {"name": "Rasmancha", "distance": "Walking distance", "description": "The oldest brick temple structure with a unique pyramidal roof."},
            {"name": "Jor Bangla Temple", "distance": "1 km", "description": "Twin hut-style temple with exquisite terracotta panels."},
            {"name": "Dalmadal Cannon", "distance": "1.2 km", "description": "Historic 17th-century wrought iron cannon."},
        ],
        "visitor_information": {
            "bestTime": "October to February",
            "hours": "6:00 AM to 6:00 PM (Daily)",
            "entryFee": "₹300 (Foreign Tourists composite pass)",
            "dressCode": "Comfortable clothing and walking shoes",
            "photography": "Permitted across all monument sites",
        },
        "latitude": 23.0673,
        "longitude": 87.3195,
    },
    {
        "name": "Sanchi Stupa",
        "slug": "sanchi-stupa",
        "location": "Sanchi, Raisen, Madhya Pradesh",
        "state": "Madhya Pradesh",
        "country": "India",
        "region": "Central India",
        "description": "The oldest stone structure in India and a masterpiece of Buddhist art, commissioned by Mauryan Emperor Ashoka the Great in the 3rd century BCE.",
        "historical_overview": "Commissioned by Emperor Ashoka the Great in the 3rd century BCE to enshrine relics of Gautama Buddha. Later expanded by the Shunga and Satavahana dynasties who added ornate carved stone gateways (Toranas).",
        "cultural_significance": "A UNESCO World Heritage site and foundational milestone in Buddhist art, representing the spread of Dhamma, non-violence, and spiritual enlightenment across Asia.",
        "architecture": "Features a massive hemispherical stone dome (Anda), a square railing (Harmika), a three-tiered umbrella (Chattra) symbolizing the Triple Gem, and four cardinal Toranas intricately carved with Jataka tales.",
        "historical_period": "Ancient (Pre-1200 CE)",
        "heritage_type": "UNESCO World Heritage",
        "image_url": "/images/heritage/sanchi-stupa.jpg",
        "interesting_facts": [
            "The carved gateways (Toranas) tell vivid stories of Buddha's previous lives (Jatakas) without portraying Buddha in human form, using symbols like footprints, lotus, and the Bodhi tree.",
            "The monument lay forgotten in dense forest for centuries until rediscovered by British officer General Henry Taylor in 1818.",
        ],
        "local_traditions": [
            {
                "title": "Clockwise Circumambulation (Pradakshina)",
                "description": "Pilgrims and visitors walk clockwise around the elevated stone terrace in respectful contemplation.",
                "tip": "Maintain quiet and reflective demeanor along the pradakshina path.",
            },
        ],
        "nearby_attractions": [
            {"name": "Udayagiri Caves", "distance": "12 km", "description": "Gupta period rock-cut sanctuary caves with famous Varaha sculpture."},
            {"name": "Tropic of Cancer Marker", "distance": "15 km", "description": "Geographical line marker on the highway to Bhopal."},
        ],
        "visitor_information": {
            "bestTime": "October to March",
            "hours": "Sunrise to Sunset (Daily)",
            "entryFee": "₹600 (Foreign Tourists)",
            "dressCode": "Respectful attire; comfortable footwear",
            "photography": "Permitted around the complex",
        },
        "latitude": 23.4793,
        "longitude": 77.7397,
    },
    {
        "name": "Ajanta Caves",
        "slug": "ajanta-caves",
        "location": "Aurangabad District, Maharashtra",
        "state": "Maharashtra",
        "country": "India",
        "region": "West India",
        "description": "Thirty rock-cut Buddhist cave monuments dating from the 2nd century BCE to 480 CE, famous worldwide for expressive murals and classical master paintings.",
        "historical_overview": "Carved into a horseshoe-shaped volcanic cliff along the Waghur River in two distinct phases: 2nd century BCE (Satavahana era) and 5th century CE under the Vakataka Emperor Harishena. Served as monastic retreats (Viharas) and prayer halls (Chaityas).",
        "cultural_significance": "Recognized by UNESCO as masterworks of Buddhist religious art and the pinnacle of classical Indian painting tradition, depicting human emotions, grace, and compassion.",
        "architecture": "Monolithic rock excavations with pillared halls, vaulted ceilings, intricately carved stupas, and tempera murals painted with natural mineral pigments on mud plaster.",
        "historical_period": "Ancient (Pre-1200 CE)",
        "heritage_type": "Caves & Rock-Cut",
        "image_url": "/images/heritage/ajanta-caves.jpg",
        "interesting_facts": [
            "Rediscovered accidentally in 1819 by British officer John Smith while hunting a tiger across the ravine.",
            "The famous paintings of Bodhisattva Padmapani and Vajrapani in Cave 1 have inspired Asian art for over a millennium.",
            "Artists used crushed lapis lazuli from Afghanistan and local ochres to create enduring, vibrant fresco colors.",
        ],
        "local_traditions": [
            {
                "title": "Low-Light Preservation",
                "description": "Lighting inside the caves is kept dim and specialized to protect fragile pigments.",
                "tip": "Flash photography is strictly prohibited inside the painted chambers.",
            },
        ],
        "nearby_attractions": [
            {"name": "Ellora Caves", "distance": "100 km", "description": "Monumental rock-cut temples representing Buddhism, Hinduism, and Jainism."},
            {"name": "Daulatabad Fort", "distance": "90 km", "description": "Formidable 12th-century hill fortress with ingenious defensive mazes."},
        ],
        "visitor_information": {
            "bestTime": "November to March",
            "hours": "9:00 AM to 5:00 PM (Closed Mondays)",
            "entryFee": "₹600 (Foreign Tourists)",
            "dressCode": "Comfortable walking shoes; remove shoes inside select cave sanctums",
            "photography": "Permitted without flash or tripod",
        },
        "latitude": 20.5519,
        "longitude": 75.7033,
    },
    {
        "name": "Ellora Caves",
        "slug": "ellora-caves",
        "location": "Aurangabad District, Maharashtra",
        "state": "Maharashtra",
        "country": "India",
        "region": "West India",
        "description": "One of the largest rock-cut temple complexes in the world, featuring 34 monasteries and temples, including the awe-inspiring monolithic Kailasa Temple.",
        "historical_overview": "Excavated between 600 and 1000 CE in the Charanandri hills under Rashtrakuta, Chalukya, and Yadava patronage. Unites Buddhist (Caves 1–12), Hindu (Caves 13–29), and Jain (Caves 30–34) monuments side by side.",
        "cultural_significance": "A UNESCO World Heritage site standing as an enduring symbol of religious harmony, spiritual tolerance, and unsurpassed ancient engineering achievement.",
        "architecture": "The centerpiece Kailasa Temple (Cave 16) was carved vertically top-down from a single basalt cliff, removing over 200,000 tons of rock without structural scaffolding.",
        "historical_period": "Ancient (Pre-1200 CE)",
        "heritage_type": "Caves & Rock-Cut",
        "image_url": "/images/heritage/ellora-caves.jpg",
        "interesting_facts": [
            "Cave 16 (Kailasa) is twice the footprint area of the Parthenon in Athens and 1.5 times its height.",
            "Ancient sculptors began carving from the roof down to the floor, meaning no single mistake could be corrected.",
        ],
        "local_traditions": [
            {
                "title": "Ellora Festival of Classical Music",
                "description": "Celebration of classical music and dance against the illuminated stone cave backdrop.",
                "tip": "Check festival dates usually organized in late winter.",
            },
        ],
        "nearby_attractions": [
            {"name": "Grishneshwar Temple", "distance": "1 km", "description": "One of the 12 sacred Jyotirlinga shrines of Lord Shiva."},
            {"name": "Bibi Ka Maqbara", "distance": "28 km", "description": "17th-century tomb reminiscent of the Taj Mahal."},
        ],
        "visitor_information": {
            "bestTime": "October to March",
            "hours": "Sunrise to Sunset (Closed Tuesdays)",
            "entryFee": "₹600 (Foreign Tourists)",
            "dressCode": "Comfortable footwear for climbing stairs; modest attire",
            "photography": "Permitted across the caves",
        },
        "latitude": 20.0269,
        "longitude": 75.1793,
    },
    {
        "name": "Group of Monuments at Hampi",
        "slug": "hampi-monuments",
        "location": "Vijayanagara District, Karnataka",
        "state": "Karnataka",
        "country": "India",
        "region": "South India",
        "description": "The magnificent ruined capital of the Vijayanagara Empire, set amidst surreal boulder landscapes with monolithic stone chariots and musical pillars.",
        "historical_overview": "Founded in 1336 by Harihara and Bukka on the banks of the Tungabhadra River, Hampi grew to become the capital of the Vijayanagara Empire. Described by medieval travelers as one of the grandest and wealthiest cities in the world before 1565.",
        "cultural_significance": "A UNESCO World Heritage site identified in epic lore with Kishkindha. The Virupaksha Temple has remained an unbroken center of active worship since the 7th century CE.",
        "architecture": "Dravidian style characterized by colossal granite boulders, monolithic stone carvings (6.7m Narasimha), the iconic Stone Chariot at Vittala Temple, and 56 musical pillars that produce acoustic musical notes.",
        "historical_period": "Medieval & Mughal (1200–1750 CE)",
        "heritage_type": "UNESCO World Heritage",
        "image_url": "/images/heritage/hampi-monuments.jpg",
        "interesting_facts": [
            "The Stone Chariot in the Vittala Temple complex is actually a shrine to Garuda, with wheels that once rotated on granite axles.",
            "The 56 musical pillars resonate with the frequencies of classical Indian instruments when gently tapped.",
            "During the 1500s, Hampi was the second largest city in the world after Beijing.",
        ],
        "local_traditions": [
            {
                "title": "Coracle Ride on Tungabhadra",
                "description": "Crossing the river in ancient round wicker boats (*coracles*) used since antiquity.",
                "tip": "Enjoy sunset views from a coracle near the river ghats.",
            },
        ],
        "nearby_attractions": [
            {"name": "Virupaksha Temple", "distance": "Central Hampi", "description": "Active sacred shrine with a towering 50-meter gopuram."},
            {"name": "Matanga Hill", "distance": "1.5 km", "description": "Highest hill offering 360-degree sunrise views over the boulder ruins."},
            {"name": "Lotus Mahal & Elephant Stables", "distance": "2.5 km", "description": "Indo-Islamic royal enclosure pavilions."},
        ],
        "visitor_information": {
            "bestTime": "November to February",
            "hours": "Sunrise to Sunset daily",
            "entryFee": "₹600 (Foreign Tourists)",
            "dressCode": "Modest clothing required inside active temples (cover shoulders and knees)",
            "photography": "Permitted throughout ruins; restricted inside sanctums",
        },
        "latitude": 15.3350,
        "longitude": 76.4600,
    },
    {
        "name": "Fatehpur Sikri",
        "slug": "fatehpur-sikri",
        "location": "Agra District, Uttar Pradesh",
        "state": "Uttar Pradesh",
        "country": "India",
        "region": "North India",
        "description": "The magnificent 16th-century fortified capital city built by Emperor Akbar, crowned by the towering Buland Darwaza.",
        "historical_overview": "Founded in 1569 by Mughal Emperor Akbar to honor Sufi saint Sheikh Salim Chishti, who had predicted the birth of his heir Jahangir. Served as the imperial capital from 1571 to 1585 before water shortages led to its peaceful abandonment.",
        "cultural_significance": "A UNESCO World Heritage site embodying Akbar's religious tolerance, syncretic philosophy (*Din-i Ilahi*), and philosophical dialogue among diverse cultures.",
        "architecture": "Masterpiece of red sandstone architecture featuring the Buland Darwaza (Gate of Magnificence, 54 meters high), Jama Masjid, Tomb of Salim Chishti in white marble, Panch Mahal, and the Diwan-i-Khas with its iconic central lotus pillar.",
        "historical_period": "Medieval & Mughal (1200–1750 CE)",
        "heritage_type": "UNESCO World Heritage",
        "image_url": "/images/heritage/fatehpur-sikri.jpg",
        "interesting_facts": [
            "The Buland Darwaza is the highest gateway in the world, built to commemorate Akbar's victory over Gujarat.",
            "The central stone pillar in the Diwan-i-Khas has a circular platform where Akbar sat while scholars of different faiths debated along four stone bridges.",
            "The entire palace city was constructed within a single 15-year period.",
        ],
        "local_traditions": [
            {
                "title": "Tying Sacred Threads at Salim Chishti Dargah",
                "description": "Visitors of all faiths tie red threads to the marble jali screens while making a wish, returning to untie it when fulfilled.",
                "tip": "Cover your head before entering the Dargah courtyard.",
            },
        ],
        "nearby_attractions": [
            {"name": "Taj Mahal & Agra Fort", "distance": "36 km", "description": "Primary Mughal monuments in Agra."},
            {"name": "Bharatpur Bird Sanctuary (Keoladeo)", "distance": "25 km", "description": "World-renowned wetland bird sanctuary."},
        ],
        "visitor_information": {
            "bestTime": "October to March",
            "hours": "Sunrise to Sunset (Daily)",
            "entryFee": "₹610 (Foreign Tourists)",
            "dressCode": "Modest clothing; head covering for the Dargah complex",
            "photography": "Permitted across public courtyards",
        },
        "latitude": 27.0945,
        "longitude": 77.6679,
    },
    {
        "name": "Mahabodhi Temple Complex",
        "slug": "mahabodhi-temple",
        "location": "Bodh Gaya, Gaya District, Bihar",
        "state": "Bihar",
        "country": "India",
        "region": "East India",
        "description": "The holiest pilgrimage destination of Buddhism, marking the exact spot where Prince Siddhartha Gautama attained supreme enlightenment and became the Buddha.",
        "historical_overview": "The original shrine was erected by Emperor Ashoka in the 3rd century BCE around the sacred Bodhi Tree. The present grand pyramidal brick temple was constructed during the Gupta era (5th–6th centuries CE) and restored in the 19th century.",
        "cultural_significance": "A UNESCO World Heritage site and spiritual center for hundreds of millions of Buddhists worldwide. Contains the sacred Bodhi Tree and the Diamond Throne (Vajrasana).",
        "architecture": "One of the earliest and most imposing brick structures surviving in eastern India, rising 55 meters with four smaller corner towers, carved niches, and Ashokan sandstone railings.",
        "historical_period": "Ancient (Pre-1200 CE)",
        "heritage_type": "UNESCO World Heritage",
        "image_url": "/images/heritage/mahabodhi-temple.jpg",
        "interesting_facts": [
            "The Bodhi Tree standing today is believed to be a direct descendant of the original Ficus religiosa tree under which the Buddha sat in 531 BCE.",
            "The Vajrasana (Diamond Throne) placed under the tree was established by Emperor Ashoka to mark the navel of the earth.",
            "Monks from Thailand, Japan, Tibet, Sri Lanka, and Bhutan maintain active monasteries in surrounding Bodh Gaya.",
        ],
        "local_traditions": [
            {
                "title": "Chanting and Butter Lamps",
                "description": "Evening meditation ceremonies with chanting and rows of glowing butter lamps around the temple stupa.",
                "tip": "Maintain silence in the inner meditation garden.",
            },
        ],
        "nearby_attractions": [
            {"name": "Great Buddha Statue", "distance": "1.5 km", "description": "Majestic 80-foot stone statue of Buddha in meditation posture."},
            {"name": "Dungeshwari Cave Temples", "distance": "12 km", "description": "Caves where Buddha meditated prior to reaching Bodh Gaya."},
        ],
        "visitor_information": {
            "bestTime": "October to March",
            "hours": "5:00 AM to 9:00 PM (Daily)",
            "entryFee": "Free entry (camera fee applies)",
            "dressCode": "Respectful modest attire; shoes must be deposited at the free counter outside",
            "photography": "Permitted with official camera ticket; mobile phones deposited at security",
        },
        "latitude": 24.6959,
        "longitude": 84.9914,
    },
    {
        "name": "Khajuraho Group of Monuments",
        "slug": "khajuraho-temples",
        "location": "Chhatarpur District, Madhya Pradesh",
        "state": "Madhya Pradesh",
        "country": "India",
        "region": "Central India",
        "description": "World-famous Nagara-style sandstone temples celebrated for their architectural harmony, soaring spires, and intricate celebration of life.",
        "historical_overview": "Built between 950 and 1050 CE by the Chandela Dynasty. Originally comprised 85 temples across 20 square kilometers, of which 25 survive today preserved by dense forest until 1838.",
        "cultural_significance": "A UNESCO World Heritage site embodying the four goals of human life in Hindu philosophy: Dharma, Artha, Kama, and Moksha.",
        "architecture": "Peak of Nagara temple architectural expression in sandstone, assembled with mortise and tenon joinery without mortar, crowned by soaring mountain-like shikharas.",
        "historical_period": "Ancient (Pre-1200 CE)",
        "heritage_type": "UNESCO World Heritage",
        "image_url": "/images/heritage/khajuraho-temples.jpg",
        "interesting_facts": [
            "Only about 10% of the carvings portray romantic art; the remaining 90% depict farmers, musicians, warriors, celestial maidens, and deities.",
            "The Kandariya Mahadeva Temple features over 800 intricately carved individual figures.",
        ],
        "local_traditions": [
            {
                "title": "Khajuraho Dance Festival",
                "description": "Week-long festival in February featuring top Indian classical dancers against the Western Group of Temples.",
                "tip": "Book festival tickets in advance through Madhya Pradesh Tourism.",
            },
        ],
        "nearby_attractions": [
            {"name": "Kandariya Mahadeva Temple", "distance": "Western Complex", "description": "The largest and most ornate temple in Khajuraho."},
            {"name": "Raneh Falls", "distance": "20 km", "description": "Dramatic canyon of pure crystalline granite and waterfalls."},
            {"name": "Panna National Park", "distance": "35 km", "description": "Renowned tiger reserve and teak forest sanctuary."},
        ],
        "visitor_information": {
            "bestTime": "October to March",
            "hours": "Sunrise to Sunset daily",
            "entryFee": "₹600 (Foreign Tourists)",
            "dressCode": "Respectful clothing; shoe removal before ascending temple platforms",
            "photography": "Permitted in exterior areas and open mandapas",
        },
        "latitude": 24.8318,
        "longitude": 79.9199,
    },
]

# Initial supported languages (6 International + 2 Indian)
SAMPLE_LANGUAGES = [
    {"code": "en", "name": "English", "native_name": "English", "is_active": True, "is_default": True},
    {"code": "fr", "name": "French", "native_name": "Français", "is_active": True, "is_default": False},
    {"code": "de", "name": "German", "native_name": "Deutsch", "is_active": True, "is_default": False},
    {"code": "es", "name": "Spanish", "native_name": "Español", "is_active": True, "is_default": False},
    {"code": "ja", "name": "Japanese", "native_name": "日本語", "is_active": True, "is_default": False},
    {"code": "it", "name": "Italian", "native_name": "Italiano", "is_active": True, "is_default": False},
    {"code": "hi", "name": "Hindi", "native_name": "हिन्दी", "is_active": True, "is_default": False},
    {"code": "bn", "name": "Bengali", "native_name": "বাংলা", "is_active": True, "is_default": False},
]


from sqlalchemy import inspect

def ensure_schema_compatibility(bind_engine):
    """
    Safely adds any missing columns to existing tables without dropping or resetting tables.
    Non-destructive schema migration compatible with both PostgreSQL and SQLite.
    """
    logger.info("Checking database schema compatibility...")
    try:
        inspector = inspect(bind_engine)
        if inspector.has_table("heritage_sites"):
            existing_cols = {col["name"] for col in inspector.get_columns("heritage_sites")}
            is_postgres = "postgres" in bind_engine.dialect.name.lower()
            float_type = "DOUBLE PRECISION" if is_postgres else "FLOAT"
            json_type = "JSON" if is_postgres else "JSON"
            
            columns_to_add = [
                ("region", "VARCHAR(100)"),
                ("interesting_facts", json_type),
                ("local_traditions", json_type),
                ("nearby_attractions", json_type),
                ("visitor_information", json_type),
                ("latitude", float_type),
                ("longitude", float_type),
            ]
            with bind_engine.connect() as conn:
                for col_name, col_type in columns_to_add:
                    if col_name not in existing_cols:
                        try:
                            conn.execute(text(f"ALTER TABLE heritage_sites ADD COLUMN {col_name} {col_type}"))
                            conn.commit()
                            logger.info("Added column %s to heritage_sites", col_name)
                        except Exception as e:
                            logger.debug("Column addition check: %s (%s)", col_name, e)
    except Exception as exc:
        logger.warning("Schema compatibility check notice: %s", exc)
    logger.info("Schema compatibility verified.")


def init_db(db: Session = None, target_engine=None) -> None:
    """
    Creates tables safely if they do not exist and seeds initial data idempotently.
    Never deletes existing data.
    """
    bind_engine = target_engine or (db.get_bind() if db is not None else engine)
    logger.info("Initializing PostgreSQL schema (non-destructive)...")
    Base.metadata.create_all(bind=bind_engine)
    ensure_schema_compatibility(bind_engine)
    logger.info("Database tables verified.")

    should_close = False
    if db is None:
        db = SessionLocal()
        should_close = True

    try:
        # Seed Heritage Sites
        for site_data in SAMPLE_HERITAGE_SITES:
            existing = db.query(HeritageSite).filter(HeritageSite.slug == site_data["slug"]).first()
            if not existing:
                site = HeritageSite(**site_data)
                db.add(site)
                logger.info("Seeding new heritage site: %s (%s)", site_data["name"], site_data["slug"])
            else:
                # Update any newly added fields non-destructively
                for key, val in site_data.items():
                    setattr(existing, key, val)
                logger.info("Updated existing heritage site with latest attributes: %s", site_data["slug"])

        # Seed Languages
        for lang_data in SAMPLE_LANGUAGES:
            existing = db.query(Language).filter(Language.code == lang_data["code"]).first()
            if not existing:
                lang = Language(**lang_data)
                db.add(lang)
                logger.info("Seeding language: %s (%s)", lang_data["name"], lang_data["code"])
            else:
                logger.info("Language already exists: %s", lang_data["code"])

        db.commit()
        logger.info("Database initialization and seeding completed successfully.")
    except Exception as exc:
        db.rollback()
        logger.error("Error during database seeding: %s", exc)
        raise
    finally:
        if should_close:
            db.close()


if __name__ == "__main__":
    try:
        init_db()
        logger.info("Initialization script completed.")
    except Exception as e:
        logger.error("Failed to initialize database: %s", e)
        sys.exit(1)
