-- ============================================================================
-- Données de démonstration (aléatoires mais réalistes) pour voir le rendu
-- final de l'application sur tous les modules.
--
-- À exécuter tel quel dans le SQL Editor de Supabase (Run). Le script
-- s'exécute avec le rôle `postgres`, qui contourne RLS — il n'est donc
-- pas affecté par le bug RLS en cours de diagnostic sur `createWedding`.
--
-- Remplacez SEED_USER_EMAIL ci-dessous par l'email du compte avec lequel
-- vous vous êtes inscrit·e sur l'app (celui que vous utiliserez pour vous
-- connecter et voir le résultat).
-- ============================================================================

do $$
declare
  v_user_id uuid;
  v_wedding_id uuid;
begin
  select id into v_user_id from auth.users where email = 'nico.dessenius@gmail.com';

  if v_user_id is null then
    raise exception 'Aucun compte trouvé pour cet email. Remplacez SEED_USER_EMAIL par l''email exact de votre compte (Authentication > Users dans Supabase).';
  end if;

  -- --------------------------------------------------------------------
  -- Mariage (le trigger on_wedding_created crée automatiquement le
  -- membre owner, les 4 critères par défaut et les 9 catégories budget)
  -- --------------------------------------------------------------------
  insert into weddings (name, wedding_date, venue_city, budget_total, guest_count_estimate, theme_description, created_by)
  values ('Nicolas & Gratia', '2027-06-12', 'Provence', 28000, 85,
          'Champêtre chic, tons sauge et terracotta, ambiance conviviale et chaleureuse.', v_user_id)
  returning id into v_wedding_id;

  -- --------------------------------------------------------------------
  -- Lieux & réceptions
  -- --------------------------------------------------------------------
  insert into venues (wedding_id, name, address, website, contact_name, contact_email, contact_phone,
                       capacity_seated, capacity_standing, price_gross, price_flat, sound_curfew,
                       catering_exclusive, onsite_lodging, onsite_lodging_capacity, status, visit_date, notes)
  values
    (v_wedding_id, 'Domaine des Charmes', '412 chemin des Oliviers, Aix-en-Provence',
     'https://domainedescharmes.example.com', 'Claire Morel', 'contact@domainedescharmes.example.com', '04 42 00 00 01',
     120, 180, 6500, 14500, '02:00', true, true, 24, 'favori', '2026-10-04',
     'Coup de cœur absolu. Magnifique grange en pierre, jardin arboré, piscine pour les invités logés sur place.'),
    (v_wedding_id, 'Château de Valmoure', '18 route de Valmoure, Lourmarin',
     'https://chateau-valmoure.example.com', 'Bertrand Achille', 'reception@chateau-valmoure.example.com', '04 42 00 00 02',
     150, 220, 9000, 18000, '01:00', true, true, 18, 'visite_planifiee', '2026-11-15',
     'Très prestigieux mais budget serré. Visite prévue mi-novembre.'),
    (v_wedding_id, 'Mas des Lavandes', '77 route de Manosque, Valensole',
     'https://masdeslavandes.example.com', 'Sophie Ricard', 'sophie@masdeslavandes.example.com', '04 42 00 00 03',
     90, 130, 4200, 9800, '00:00', false, true, 14, 'visite_faite', '2026-09-02',
     'Vue superbe sur les champs de lavande. Sono coupée à minuit, un peu tôt pour nous.'),
    (v_wedding_id, 'La Grange du Verger', '5 chemin du Verger, Gordes',
     null, 'Pauline Serra', 'pauline.serra@example.com', '04 42 00 00 04',
     80, 100, 3800, null, '01:30', false, false, 0, 'a_visiter', null,
     'Repéré sur Instagram, à contacter pour organiser une visite.'),
    (v_wedding_id, 'Bastide des Cigales', '9 route d''Apt, Roussillon',
     'https://bastide-cigales.example.com', 'Marc Fontaine', 'marc@bastide-cigales.example.com', '04 42 00 00 05',
     100, 150, 5200, 11000, '01:00', true, false, 0, 'ecarte', '2026-08-20',
     'Beau lieu mais traiteur imposé trop cher pour notre budget.');

  insert into venue_scores (venue_id, criterion_id, score)
  select v.id, c.id, s.score
  from (values
    ('Domaine des Charmes', 'Coup de cœur', 5),
    ('Domaine des Charmes', 'Budget', 3),
    ('Domaine des Charmes', 'Flexibilité', 5),
    ('Domaine des Charmes', 'Accessibilité pour les proches', 4),
    ('Château de Valmoure', 'Coup de cœur', 4),
    ('Château de Valmoure', 'Budget', 1),
    ('Château de Valmoure', 'Flexibilité', 3),
    ('Château de Valmoure', 'Accessibilité pour les proches', 3),
    ('Mas des Lavandes', 'Coup de cœur', 4),
    ('Mas des Lavandes', 'Budget', 4),
    ('Mas des Lavandes', 'Flexibilité', 3),
    ('Mas des Lavandes', 'Accessibilité pour les proches', 4),
    ('La Grange du Verger', 'Coup de cœur', 3),
    ('La Grange du Verger', 'Budget', 5),
    ('Bastide des Cigales', 'Coup de cœur', 2),
    ('Bastide des Cigales', 'Budget', 2)
  ) as s(venue_name, criterion_name, score)
  join venues v on v.wedding_id = v_wedding_id and v.name = s.venue_name
  join criteria c on c.wedding_id = v_wedding_id and c.name = s.criterion_name;

  -- --------------------------------------------------------------------
  -- Hébergements & chambres
  -- --------------------------------------------------------------------
  insert into accommodations (wedding_id, type, name, address, distance_minutes, direction, total_rooms,
                               total_capacity, price_per_night, booking_status, website, phone, notes)
  values
    (v_wedding_id, 'sur_place', 'Suites du Domaine des Charmes', '412 chemin des Oliviers, Aix-en-Provence',
     0, null, 6, 24, 0, 'reserve', null, '04 42 00 00 01', 'Incluses dans le forfait du lieu.'),
    (v_wedding_id, 'hotel', 'Hôtel des Augustins', '3 rue de la Masse, Aix-en-Provence',
     12, 'N', 40, 70, 165, 'a_contacter', 'https://hotel-augustins.example.com', '04 42 11 22 33', 'Bien situé en centre-ville, propose un tarif groupe.'),
    (v_wedding_id, 'gite', 'Gîte des Collines', '22 chemin des Restanques, Puyricard',
     8, 'E', 4, 10, 95, 'option', 'https://gite-collines.example.com', '06 12 34 56 78', 'Idéal pour la famille proche, réponse attendue sous 15 jours.'),
    (v_wedding_id, 'airbnb', 'Mas provençal avec piscine', 'Route de Venelles, Aix-en-Provence',
     18, 'SE', 5, 12, 140, 'a_contacter', null, null, 'Repéré sur Airbnb pour les amis.'),
    (v_wedding_id, 'hotel', 'Ibis Budget Aix Nord', 'Zone Krypton, Aix-en-Provence',
     25, 'NO', 60, 100, 75, 'annule', 'https://ibis.example.com', '04 42 44 55 66', 'Trop loin et trop impersonnel, écarté.');

  insert into rooms (accommodation_id, name, capacity, price_per_night, nights, payer, notes, order_index)
  select a.id, r.name, r.capacity, r.price, r.nights, r.payer, r.notes, r.ord
  from (values
    ('Suites du Domaine des Charmes', 'Suite nuptiale', 2, 0::numeric, 2, 'nous', 'Pour nous deux, la veille et le soir des noces.', 0),
    ('Suites du Domaine des Charmes', 'Chambre famille — parents Nicolas', 4, 0::numeric, 1, 'nous', null, 1),
    ('Suites du Domaine des Charmes', 'Chambre témoins', 2, 0::numeric, 1, 'nous', null, 2),
    ('Hôtel des Augustins', 'Chambre double standard', 2, 165::numeric, 1, 'invites', 'Tarif groupe -10 %.', 0),
    ('Gîte des Collines', 'Gîte entier (famille)', 8, 95::numeric, 2, 'nous', 'Pour les grands-parents et la famille proche.', 0)
  ) as r(acc_name, name, capacity, price, nights, payer, notes, ord)
  join accommodations a on a.wedding_id = v_wedding_id and a.name = r.acc_name;

  insert into guests (wedding_id, first_name, last_name, group_label, side, plus_one, children_count,
                       rsvp_status, dietary_restrictions, needs_lodging, email, phone, notes)
  values
    (v_wedding_id, 'Marc', 'Dessenius', 'Famille Nicolas', 'marie1', true, 0, 'confirme', null, true, 'marc.d@example.com', null, 'Père du marié'),
    (v_wedding_id, 'Isabelle', 'Dessenius', 'Famille Nicolas', 'marie1', false, 0, 'confirme', 'Sans gluten', true, 'isabelle.d@example.com', null, 'Mère du marié'),
    (v_wedding_id, 'Julien', 'Dessenius', 'Famille Nicolas', 'marie1', true, 2, 'confirme', null, true, null, null, 'Frère, vient avec ses enfants'),
    (v_wedding_id, 'Élise', 'Marchal', 'Témoins', 'marie1', false, 0, 'confirme', null, true, 'elise.m@example.com', '06 00 00 00 01', 'Témoin de Nicolas'),
    (v_wedding_id, 'Antoine', 'Berger', 'Amis', 'marie1', true, 0, 'en_attente', null, false, null, null, null),
    (v_wedding_id, 'Christos', 'Gratia', 'Famille Gratia', 'marie2', true, 0, 'confirme', 'Végétarien', true, null, null, 'Père de Gratia'),
    (v_wedding_id, 'Anna', 'Gratia', 'Famille Gratia', 'marie2', false, 0, 'confirme', 'Végétarienne', true, null, null, 'Mère de Gratia'),
    (v_wedding_id, 'Sofia', 'Papadakis', 'Témoins', 'marie2', false, 0, 'confirme', null, true, 'sofia.p@example.com', '06 00 00 00 02', 'Témoin de Gratia'),
    (v_wedding_id, 'Nikos', 'Papadakis', 'Amis', 'marie2', true, 1, 'en_attente', null, false, null, null, null),
    (v_wedding_id, 'Camille', 'Roux', 'Amis communs', 'les_deux', true, 0, 'decline', null, false, null, null, 'Empêchée, en déplacement professionnel'),
    (v_wedding_id, 'Hugo', 'Lefebvre', 'Amis communs', 'les_deux', false, 0, 'confirme', null, false, null, null, null),
    (v_wedding_id, 'Léa', 'Fontaine', 'Amis communs', 'les_deux', true, 0, 'en_attente', 'Allergie fruits à coque', false, 'lea.f@example.com', null, null);

  insert into room_assignments (room_id, guest_id, nights)
  select r.id, g.id, ra.nights
  from (values
    ('Chambre famille — parents Nicolas', 'Marc', 'Dessenius', 1),
    ('Chambre famille — parents Nicolas', 'Isabelle', 'Dessenius', 1),
    ('Chambre témoins', 'Élise', 'Marchal', 1),
    ('Gîte entier (famille)', 'Christos', 'Gratia', 2),
    ('Gîte entier (famille)', 'Anna', 'Gratia', 2)
  ) as ra(room_name, first_name, last_name, nights)
  join rooms r on r.name = ra.room_name
  join accommodations a on a.id = r.accommodation_id and a.wedding_id = v_wedding_id
  join guests g on g.wedding_id = v_wedding_id and g.first_name = ra.first_name and g.last_name = ra.last_name;

  -- --------------------------------------------------------------------
  -- Cérémonie & déroulé
  -- --------------------------------------------------------------------
  insert into ceremony_events (wedding_id, title, category, start_time, duration_minutes, location,
                                music, outfits, cortege, speeches, notes, order_index)
  values
    (v_wedding_id, 'Cérémonie civile', 'ceremonie_civile', '14:00', 30, 'Mairie d''Aix-en-Provence',
     null, 'Tenue civile élégante, pas de robe longue.', null, null, 'Prévoir 20 min de battement pour les photos devant la mairie.', 0),
    (v_wedding_id, 'Cérémonie laïque', 'ceremonie_engagement', '16:30', 45, 'Jardin du Domaine des Charmes',
     'Marche nuptiale : "A Thousand Years" (Christina Perri), version piano.',
     'Robe longue ivoire, costume lin sable.',
     'Entrée des témoins, puis des parents, puis de la mariée au bras de son père.',
     'Discours des deux témoins (5 min chacun) + lecture par la sœur de Gratia.',
     'Prévoir des chaises pliantes supplémentaires si pluie.', 1),
    (v_wedding_id, 'Vin d''honneur', 'vin_honneur', '17:30', 90, 'Terrasse et jardins',
     'Playlist lounge (DJ)', null, null, null, 'Buffet de bouchées salées/sucrées, bar à cocktails.', 2),
    (v_wedding_id, 'Photos de groupe', 'autre', '18:30', 30, 'Allée des oliviers',
     null, null, null, null, 'Prévoir un plan des groupes photo pour gagner du temps.', 3),
    (v_wedding_id, 'Dîner', 'diner', '20:00', 120, 'Grange principale',
     'Musique d''ambiance douce pendant le repas.', null, 'Entrée des mariés annoncée par le DJ.',
     'Discours des parents pendant le fromage.', 'Plan de table à valider avec le traiteur avant le 1er mai.', 4),
    (v_wedding_id, 'Ouverture de bal', 'ouverture_bal', '22:00', 15, 'Grange principale',
     '"Can''t Help Falling in Love" — reprise Kina Grannis', null, null, null,
     'Un cours de danse prévu en mai pour être à l''aise.', 5),
    (v_wedding_id, 'Soirée dansante', 'soiree', '22:15', 180, 'Grange principale',
     'DJ set, playlist collaborative envoyée aux invités.', null, null, null,
     'Feu d''artifice silencieux prévu vers minuit.', 6);

  insert into ceremony_protocols (wedding_id, event_id, type, title, content, order_index)
  values
    (v_wedding_id, null, 'tenues', 'Tenues du cortège',
     'Témoins hommes : costume lin bleu marine, chemise blanche, pas de cravate.' || chr(10) ||
     'Témoins femmes : robe vert sauge, longueur midi.' || chr(10) ||
     'Enfants d''honneur : blanc et sauge.', 0),
    (v_wedding_id, null, 'interventions', 'Ordre des discours',
     '1. Témoin de Nicolas (5 min)' || chr(10) ||
     '2. Témoin de Gratia (5 min)' || chr(10) ||
     '3. Sœur de Gratia — lecture d''un texte (3 min)' || chr(10) ||
     '4. Parents des mariés, pendant le fromage (10 min à deux)', 1);

  -- --------------------------------------------------------------------
  -- Prestataires (kanban)
  -- --------------------------------------------------------------------
  insert into vendors (wedding_id, category, name, contact_name, contact_email, contact_phone, website,
                        status, next_contact_date, quote_amount, deposit_amount, deposit_paid, rating, notes)
  values
    (v_wedding_id, 'traiteur', 'Table & Terroir', 'Vincent Aubert', 'contact@tableterroir.example.com', '06 11 22 33 44',
     'https://tableterroir.example.com', 'valide', null, 8200, 2000, true, 5, 'Validé ! Menu provençal, dégustation prévue en avril.'),
    (v_wedding_id, 'photographe', 'Claire Odette Photographie', 'Claire Odette', 'hello@claireodette.example.com', '06 22 33 44 55',
     'https://claireodette.example.com', 'valide', null, 2600, 800, true, 5, 'Style naturel et lumineux, exactement ce qu''on cherchait.'),
    (v_wedding_id, 'videaste', 'Studio Lumen', 'Yanis Cordier', 'yanis@studiolumen.example.com', '06 33 44 55 66',
     'https://studiolumen.example.com', 'devis_recu', '2026-10-10', 3200, null, false, 4, 'Devis reçu, encore à comparer avec un autre studio.'),
    (v_wedding_id, 'dj_son', 'DJ Mova', 'Mova', 'contact@djmova.example.com', '06 44 55 66 77',
     null, 'visite_call_planifie', '2026-10-05', 1800, null, false, 4, 'Call découverte prévu la semaine prochaine.'),
    (v_wedding_id, 'fleuriste', 'Atelier Fleur de Lin', 'Camille Girard', 'camille@fleurdelin.example.com', '06 55 66 77 88',
     'https://fleurdelin.example.com', 'devis_recu', '2026-10-20', 1450, null, false, null, 'Propose des compositions sauge et terracotta, très proche de notre moodboard.'),
    (v_wedding_id, 'papeterie', 'Petits Mots Doux', 'Nora Benali', 'nora@petitsmotsdoux.example.com', null,
     'https://petitsmotsdoux.example.com', 'a_contacter', null, null, null, false, null, 'Repérée sur Instagram, à contacter pour les faire-part.'),
    (v_wedding_id, 'autre', 'Traiteur Saveurs du Sud', 'Karim Belhadj', 'karim@saveursdusud.example.com', '06 66 77 88 99',
     null, 'ecarte', null, 7400, null, false, 3, 'Bon rapport qualité-prix mais moins de disponibilités que Table & Terroir.');

  -- --------------------------------------------------------------------
  -- Moodboard
  -- --------------------------------------------------------------------
  insert into moodboard_items (wedding_id, type, title, color_hex, image_url, link_url, tags, order_index)
  values
    (v_wedding_id, 'palette', 'Sauge', '#5f7752', null, null, array['principal'], 0),
    (v_wedding_id, 'palette', 'Sauge pâle', '#dfe6d3', null, null, array['secondaire'], 1),
    (v_wedding_id, 'palette', 'Terracotta', '#b5673a', null, null, array['accent'], 2),
    (v_wedding_id, 'palette', 'Crème', '#f4f2ea', null, null, array['fond'], 3),
    (v_wedding_id, 'palette', 'Doré', '#a8843f', null, null, array['accent', 'ornement'], 4),
    (v_wedding_id, 'matiere', 'Lin naturel', null, 'https://images.example.com/lin.jpg', null, array['tenues', 'nappage'], 0),
    (v_wedding_id, 'matiere', 'Rotin', null, 'https://images.example.com/rotin.jpg', null, array['déco', 'mobilier'], 1),
    (v_wedding_id, 'matiere', 'Velours terracotta', null, 'https://images.example.com/velours.jpg', null, array['déco'], 2),
    (v_wedding_id, 'typographie', 'Cormorant Garamond', null, null, null, array['titres', 'faire-part'], 0),
    (v_wedding_id, 'typographie', 'Hanken Grotesk', null, null, null, array['texte courant'], 1),
    (v_wedding_id, 'papier', 'Faire-part suspendu', null, 'https://images.example.com/faire-part.jpg', 'https://petitsmotsdoux.example.com', array['papeterie'], 0),
    (v_wedding_id, 'papier', 'Plan de table calligraphié', null, 'https://images.example.com/plan-table.jpg', null, array['papeterie', 'jour-j'], 1),
    (v_wedding_id, 'floral', 'Bouquet champêtre sauge & eucalyptus', null, 'https://images.example.com/bouquet.jpg', null, array['bouquet'], 0),
    (v_wedding_id, 'floral', 'Arche florale champêtre', null, 'https://images.example.com/arche.jpg', null, array['cérémonie'], 1),
    (v_wedding_id, 'floral', 'Centre de table bas', null, 'https://images.example.com/centre-table.jpg', null, array['réception'], 2),
    (v_wedding_id, 'scenographie', 'Allée de cérémonie en extérieur', null, 'https://images.example.com/allee.jpg', null, array['cérémonie'], 0),
    (v_wedding_id, 'scenographie', 'Tables longues façon banquet', null, 'https://images.example.com/tables.jpg', null, array['diner'], 1),
    (v_wedding_id, 'scenographie', 'Guirlandes guinguette', null, 'https://images.example.com/guirlandes.jpg', null, array['soirée'], 2);

  -- --------------------------------------------------------------------
  -- Budget (les catégories par défaut existent déjà via le trigger)
  -- --------------------------------------------------------------------
  insert into budget_items (wedding_id, category_id, vendor_id, label, estimated_amount, quote_amount,
                             paid_amount, due_date, status, notes)
  select v_wedding_id, c.id, v.id, b.label, b.estimated, b.quote, b.paid, b.due_date, b.status, b.notes
  from (values
    ('Lieu & réception', 'Domaine des Charmes', 'Location du domaine', 7000::numeric, 6500::numeric, 2000::numeric, '2026-12-01'::date, 'acompte_verse', null),
    ('Traiteur', 'Table & Terroir', 'Traiteur — menu 4 services', 8000::numeric, 8200::numeric, 2000::numeric, '2027-04-01'::date, 'acompte_verse', 'Solde dû 15 jours avant le mariage.'),
    ('Photographe / Vidéaste', 'Claire Odette Photographie', 'Photographe — journée complète', 2600::numeric, 2600::numeric, 800::numeric, '2027-03-01'::date, 'acompte_verse', null),
    ('Photographe / Vidéaste', 'Studio Lumen', 'Vidéaste — film + teaser', 3000::numeric, 3200::numeric, 0::numeric, '2027-05-01'::date, 'devis', null),
    ('DJ / Sonorisation', 'DJ Mova', 'DJ — soirée complète', 1800::numeric, null, 0::numeric, null, 'a_prevoir', null),
    ('Fleuriste', 'Atelier Fleur de Lin', 'Fleuriste — bouquet, arche, centres de table', 1500::numeric, 1450::numeric, 0::numeric, '2027-05-15'::date, 'devis', null),
    ('Papeterie', null, 'Faire-part et papeterie jour J', 600::numeric, null, 0::numeric, null, 'a_prevoir', null),
    ('Hébergement', null, 'Chambres invités (part à notre charge)', 900::numeric, null, 0::numeric, null, 'a_prevoir', null),
    ('Tenues & beauté', null, 'Robe de mariée', 1800::numeric, 1650::numeric, 1650::numeric, '2026-11-01'::date, 'paye', 'Essayage final en septembre.'),
    ('Tenues & beauté', null, 'Costume du marié', 700::numeric, 650::numeric, 650::numeric, '2026-11-01'::date, 'paye', null),
    ('Divers', null, 'Alliances', 1200::numeric, null, 0::numeric, null, 'a_prevoir', null),
    ('Divers', null, 'Feu d''artifice silencieux', 400::numeric, 380::numeric, 380::numeric, '2027-05-01'::date, 'paye', null)
  ) as b(category_name, vendor_name, label, estimated, quote, paid, due_date, status, notes)
  left join budget_categories c on c.wedding_id = v_wedding_id and c.name = b.category_name
  left join vendors v on v.wedding_id = v_wedding_id and v.name = b.vendor_name;

  -- --------------------------------------------------------------------
  -- Tâches
  -- --------------------------------------------------------------------
  insert into tasks (wedding_id, title, due_date, assigned_to, area, done, notes)
  values
    (v_wedding_id, 'Signer le contrat avec le Domaine des Charmes', '2026-10-15', 'les_deux', 'Lieu', true, null),
    (v_wedding_id, 'Goûter le menu chez Table & Terroir', '2026-10-01', 'les_deux', 'Menu', true, null),
    (v_wedding_id, 'Choisir la robe de mariée', '2026-09-30', 'marie2', 'Tenues', true, null),
    (v_wedding_id, 'Envoyer les faire-part', '2027-01-15', 'les_deux', 'Autre', false, 'Attendre le devis de Petits Mots Doux.'),
    (v_wedding_id, 'Réserver le bloc de chambres à l''Hôtel des Augustins', '2026-10-31', 'marie1', 'Lieu', false, null),
    (v_wedding_id, 'Prendre rendez-vous chez le DJ', '2026-10-05', 'marie1', 'Musique', false, null),
    (v_wedding_id, 'Finaliser la playlist de la cérémonie', '2027-03-01', 'marie2', 'Musique', false, null),
    (v_wedding_id, 'Prendre rendez-vous à la mairie', '2026-11-10', 'les_deux', 'Cérémonie', false, null),
    (v_wedding_id, 'Essayage final costume', '2027-04-15', 'marie1', 'Tenues', false, null),
    (v_wedding_id, 'Relancer le fleuriste pour le devis définitif', '2026-10-20', 'marie2', 'Déco', false, null);

  -- --------------------------------------------------------------------
  -- Idées
  -- --------------------------------------------------------------------
  insert into ideas (wedding_id, content, tag, author_id, link_url, pinned)
  values
    (v_wedding_id, 'Un photobooth avec accessoires vintage près du bar à cocktails.', 'Déco', v_user_id, null, true),
    (v_wedding_id, 'Livre d''or sous forme de polaroids à coller par les invités.', 'Autre', v_user_id, null, false),
    (v_wedding_id, 'Bar à limonades artisanales pour la cérémonie (il fera chaud en juin).', 'Menu', v_user_id, null, true),
    (v_wedding_id, 'Faire venir un food-truck à glaces en fin de soirée.', 'Menu', v_user_id, null, false),
    (v_wedding_id, 'Demander à la sœur de Gratia de jouer un morceau de violon pendant le vin d''honneur.', 'Musique', v_user_id, null, false),
    (v_wedding_id, 'Panneau "petit plan du domaine" à l''entrée pour guider les invités.', 'Autre', v_user_id, null, false);

  raise notice 'Seed terminé pour le mariage % (id %)', 'Nicolas & Gratia', v_wedding_id;
end $$;
