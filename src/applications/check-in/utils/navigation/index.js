import { differenceInCalendarDays } from 'date-fns';
import { isInAllowList } from '../appConstants';

const isWithInDays = (days, pageLastUpdated) => {
  const daysAgo = differenceInCalendarDays(Date.now(), pageLastUpdated);
  return daysAgo <= days;
};

const updateFormPages = (
  patientDemographicsStatus,
  pages,
  URLS,
  isTravelReimbursementEnabled = false,
  appointments = [],
) => {
  const skippedPages = [];
  const {
    demographicsNeedsUpdate,
    demographicsConfirmedAt,
    nextOfKinNeedsUpdate,
    nextOfKinConfirmedAt,
    emergencyContactNeedsUpdate,
    emergencyContactConfirmedAt,
  } = patientDemographicsStatus;

  const skippablePages = [
    {
      url: URLS.DEMOGRAPHICS,
      confirmedAt: demographicsConfirmedAt,
      needsUpdate: demographicsNeedsUpdate,
    },
    {
      url: URLS.NEXT_OF_KIN,
      confirmedAt: nextOfKinConfirmedAt,
      needsUpdate: nextOfKinNeedsUpdate,
    },
    {
      url: URLS.EMERGENCY_CONTACT,
      confirmedAt: emergencyContactConfirmedAt,
      needsUpdate: emergencyContactNeedsUpdate,
    },
  ];
  skippablePages.forEach(page => {
    const pageLastUpdated = page.confirmedAt
      ? new Date(page.confirmedAt)
      : null;
    if (
      pageLastUpdated &&
      isWithInDays(7, pageLastUpdated) &&
      page.needsUpdate === false
    ) {
      skippedPages.push(page.url);
    }
  });

  const travelPayPages = [
    URLS.TRAVEL_QUESTION,
    URLS.TRAVEL_VEHICLE,
    URLS.TRAVEL_ADDRESS,
    URLS.TRAVEL_MILEAGE,
  ];

  // Skip travel pay if not enabled, if veteran has more than one appointment for the day, or station if not in the allow list.
  // The allowlist currently only looks at the first appointment in the array, if we support multiple appointments later, this will need to get updated to a loop.
  if (
    !isTravelReimbursementEnabled ||
    appointments.length > 1 ||
    !isInAllowList(appointments[0])
  ) {
    skippedPages.push(...travelPayPages);
  }
  return pages.filter(page => !skippedPages.includes(page));
};

const URLS = Object.freeze({
  CONFIRMATION: 'complete',
  DEMOGRAPHICS: 'contact-information',
  EMERGENCY_CONTACT: 'emergency-contact',
  ERROR: 'error',
  INTRODUCTION: 'introduction',
  LANDING: '',
  NEXT_OF_KIN: 'next-of-kin',
  SEE_STAFF: 'see-staff',
  VERIFY: 'verify',
  COMPLETE: 'complete',
  DETAILS: 'details',
  VALIDATION_NEEDED: 'verify',
  LOADING: 'loading-appointments',
  TRAVEL_QUESTION: 'travel-pay',
  TRAVEL_VEHICLE: 'travel-vehicle',
  TRAVEL_ADDRESS: 'travel-address',
  TRAVEL_MILEAGE: 'travel-mileage',
  APPOINTMENT_DETAILS: 'appointment-details',
});

export { updateFormPages, URLS };
