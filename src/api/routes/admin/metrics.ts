import { Router, Request, Response } from 'express';
import User from '../../../models/User';
import Survey from '../../../models/Survey';
import Enquiry from '../../../models/Enquiry';
import { ResponseWrapper } from '../../responseWrapper';

interface IUserMetrics {
  age?: string;
  gender?: string;
  healthScore?: number;
}

export default (router: Router) => {
    router.get('/metrics', async (req: Request, res: Response) => {
        try {
            const totalUsers = await User.countDocuments({ userRole: 'patient' });
            
            // Calculate average health score
            const users = await User.find({ userRole: 'patient' }) as unknown as IUserMetrics[];
            const avgHealthScore = totalUsers
                ? Math.round(users.reduce((sum, u) => sum + (u.healthScore || 0), 0) / totalUsers)
                : 0;

            const totalSurveys = await Survey.countDocuments();
            const pendingEnquiries = await Enquiry.countDocuments({ status: 'New' });

            // Demographics breakdowns
            const ageGroups = {
                "18-25": users.filter(u => parseInt(u.age || '0') >= 18 && parseInt(u.age || '0') <= 25).length,
                "26-35": users.filter(u => parseInt(u.age || '0') >= 26 && parseInt(u.age || '0') <= 35).length,
                "36-45": users.filter(u => parseInt(u.age || '0') >= 36 && parseInt(u.age || '0') <= 45).length,
                "46-60": users.filter(u => parseInt(u.age || '0') >= 46 && parseInt(u.age || '0') <= 60).length,
                "60+": users.filter(u => parseInt(u.age || '0') > 60).length,
            };

            const genders = {
                Male: users.filter(u => u.gender === 'Male').length,
                Female: users.filter(u => u.gender === 'Female').length,
                Other: users.filter(u => u.gender === 'Other').length,
            };

            return ResponseWrapper.success(res, {
                totalUsers,
                avgHealthScore,
                totalSurveys,
                pendingEnquiries,
                ageGroups,
                genders
            });
        } catch (e: any) {
            return ResponseWrapper.error(res, e);
        }
    });
};
