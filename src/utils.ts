// Calendar-aware math you'd get wrong reimplementing

export function getAge(dob: Date, now: Date = new Date()): number {
  const years = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  const dayDiff = now.getDate() - dob.getDate();

  // Subtract a year if birthday hasn't happened yet this year
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    return years - 1;
  }

  return years;
}

export function daysSinceAge(dob: Date, ageYears: number, now: Date = new Date()): number {
  const birthDate = new Date(dob);

  // Calculate the date when they turned ageYears old
  const ageDate = new Date(
    birthDate.getFullYear() + ageYears,
    birthDate.getMonth(),
    birthDate.getDate()
  );

  // Calculate days from that date to now
  const diffMs = now.getTime() - ageDate.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return Math.max(0, days); // Don't return negative if they haven't reached that age yet
}
