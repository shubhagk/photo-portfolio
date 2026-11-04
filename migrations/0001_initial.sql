CREATE TABLE IF NOT EXISTS photos (
  id TEXT PRIMARY KEY,
  object_key TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT '',
  year INTEGER,
  country TEXT NOT NULL DEFAULT '',
  species TEXT NOT NULL DEFAULT '',
  subspecies TEXT NOT NULL DEFAULT '',
  place TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS photos_category_idx ON photos(category);
CREATE INDEX IF NOT EXISTS photos_country_idx ON photos(country);
CREATE INDEX IF NOT EXISTS photos_species_idx ON photos(species);
CREATE INDEX IF NOT EXISTS photos_year_idx ON photos(year);

CREATE VIRTUAL TABLE IF NOT EXISTS photo_search USING fts5(
  photo_id UNINDEXED,
  category,
  country,
  species,
  subspecies,
  place,
  description,
  tokenize = 'unicode61 remove_diacritics 2'
);

CREATE TRIGGER IF NOT EXISTS photos_search_insert AFTER INSERT ON photos BEGIN
  INSERT INTO photo_search (photo_id, category, country, species, subspecies, place, description)
  VALUES (new.id, new.category, new.country, new.species, new.subspecies, new.place, new.description);
END;

CREATE TRIGGER IF NOT EXISTS photos_search_delete AFTER DELETE ON photos BEGIN
  DELETE FROM photo_search WHERE photo_id = old.id;
END;

CREATE TRIGGER IF NOT EXISTS photos_search_update AFTER UPDATE ON photos BEGIN
  DELETE FROM photo_search WHERE photo_id = old.id;
  INSERT INTO photo_search (photo_id, category, country, species, subspecies, place, description)
  VALUES (new.id, new.category, new.country, new.species, new.subspecies, new.place, new.description);
END;
