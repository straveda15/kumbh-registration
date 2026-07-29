import { DISTRICTS_BY_STATE } from './indianDistrictsByState';
import { TALUKAS_BY_DISTRICT } from './indianTalukasByDistrict';
import { CITIES_BY_STATE, getVillagesForTaluka } from './indianCitiesByState';

/**
 * Returns available districts for a given state, intelligently filtered if a city is selected.
 */
export function getAvailableDistricts(state, city) {
  if (!state) return [];
  const stateDistricts = DISTRICTS_BY_STATE[state] || [];

  if (!city) {
    return stateDistricts;
  }

  const cityLower = city.trim().toLowerCase();

  // Find districts matching the city directly or containing it in their talukas/villages
  const matchingDistricts = stateDistricts.filter((dist) => {
    if (dist.toLowerCase() === cityLower || cityLower.includes(dist.toLowerCase())) return true;

    const talukas = TALUKAS_BY_DISTRICT[dist] || [];
    if (talukas.some((t) => t.toLowerCase() === cityLower || cityLower.includes(t.toLowerCase()))) return true;

    for (const t of talukas) {
      const villages = getVillagesForTaluka(t, dist);
      if (villages.some((v) => v.toLowerCase() === cityLower)) return true;
    }
    return false;
  });

  return matchingDistricts.length > 0 ? matchingDistricts : stateDistricts;
}

/**
 * Returns available talukas for a state & district, intelligently filtered if a city is selected.
 */
export function getAvailableTalukas(state, district, city) {
  if (!state) return [];

  let poolOfTalukas = [];
  if (district) {
    poolOfTalukas = TALUKAS_BY_DISTRICT[district] || [];
  } else {
    const districts = DISTRICTS_BY_STATE[state] || [];
    for (const d of districts) {
      const tList = TALUKAS_BY_DISTRICT[d] || [];
      for (const t of tList) {
        if (!poolOfTalukas.includes(t)) poolOfTalukas.push(t);
      }
    }
  }

  if (!city) {
    return poolOfTalukas;
  }

  const cityLower = city.trim().toLowerCase();

  const matchingTalukas = poolOfTalukas.filter((taluka) => {
    if (taluka.toLowerCase() === cityLower || cityLower.includes(taluka.toLowerCase())) return true;
    const villages = getVillagesForTaluka(taluka, district || '');
    return villages.some((v) => v.toLowerCase() === cityLower);
  });

  return matchingTalukas.length > 0 ? matchingTalukas : poolOfTalukas;
}

/**
 * Returns available cities/villages based on State, District, and Taluka selections.
 */
export function getAvailableCities(state, district, taluka) {
  if (!state) return [];

  // Case 1: Taluka is selected -> return cities for that specific taluka
  if (taluka) {
    return getVillagesForTaluka(taluka, district || '');
  }

  const stateCities = CITIES_BY_STATE[state] || [];

  // Case 2: District is selected (no taluka) -> return cities for that district & state
  if (district) {
    const talukas = TALUKAS_BY_DISTRICT[district] || [];
    const districtCities = [];

    // Add matching state cities
    for (const c of stateCities) {
      if (c.toLowerCase().includes(district.toLowerCase()) || district.toLowerCase().includes(c.toLowerCase())) {
        if (!districtCities.includes(c)) districtCities.push(c);
      }
    }

    // Add villages from district's talukas
    for (const t of talukas) {
      const villages = getVillagesForTaluka(t, district);
      for (const v of villages) {
        if (!districtCities.includes(v)) districtCities.push(v);
      }
    }

    // Fallback: append other state cities so any city remains selectable
    for (const c of stateCities) {
      if (!districtCities.includes(c)) districtCities.push(c);
    }
    return districtCities;
  }

  // Case 3: Only State is selected -> return all cities/towns in that state
  return stateCities;
}
