import ChallengeGroup from '../models/ChallengeGroup';
import clc from 'cli-color';

const getTodayDate = () => {
  const date = new Date();

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const getStartDate = () => {
  const date = new Date();

  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 31);
};

const checkOngoingChallengeGroup = async () => {
  const start_date: any = getTodayDate();

  // Find Challenge Group that Start Date is Today
  let challengeGroups: any;

  try {
    challengeGroups = await ChallengeGroup.findAll({ where: { start_date } });
  } catch (e) {
    console.log(
      clc.red(
        'Cannot Find Corresponding Challenge Group (location: checkOngoingChallengeGroup)',
      ),
    );
    return;
  }

  if (challengeGroups.length === 0) return;

  await challengeGroups.forEach(async (challengeGroup: any) => {
    await challengeGroup.update({ status: 'ONGOING' });
  });
};

const checkCompleteChallengeGroup = async () => {
  const start_date: any = getStartDate();

  // Find Challenge Group that End Date is Today
  let challengeGroups: any;

  try {
    challengeGroups = await ChallengeGroup.findAll({ where: { start_date } });
  } catch (e) {
    console.log(
      clc.red(
        'Cannot Find Corresponding Challenge Group (location: checkCompleteChallengeGroup)',
      ),
    );
    return;
  }

  if (challengeGroups.length === 0) return;
};

const cronjob = async () => {
  await checkOngoingChallengeGroup();
  await checkCompleteChallengeGroup();
};

export default cronjob;
