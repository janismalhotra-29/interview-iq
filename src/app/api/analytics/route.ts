import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'd0000000-0000-0000-0000-000000000001';

    const user = await db.getUser(userId);
    const profile = await db.getUserProfile(userId);
    const sessions = await db.listUserSessions(userId);
    const skillAnalytics = await db.getUserSkillAnalytics(userId);
    const recommendations = await db.getUserRecommendations(userId);
    const badges = await db.getUserBadges(userId);

    // Completed sessions only for analytics
    const completed = sessions.filter((s) => s.status === 'completed');

    // Total interviews & average score
    const totalCompleted = completed.length;
    const avgScore = totalCompleted > 0
      ? Number((completed.reduce((acc, s) => acc + (s.overall_score || 0), 0) / totalCompleted).toFixed(1))
      : 0;

    // Overall readiness percentage: scale average score to readiness tier
    const readinessPercentage = Math.min(100, Math.round(avgScore * 1.05));

    // Radar chart data for the 5 weighted dimensions
    const radarData = skillAnalytics.map((s) => ({
      subject: s.skill_category,
      score: s.proficiency_score,
      fullMark: 100,
    }));

    // Historical progression data (oldest to newest)
    const historyTrend = [...completed]
      .reverse()
      .map((s, idx) => ({
        index: idx + 1,
        title: s.title,
        date: new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: s.overall_score || 0,
        role: s.job_role,
        difficulty: s.difficulty,
        timeTaken: Math.round((s.time_taken_seconds || 600) / 60),
      }));

    // Strongest & weakest skills
    const sortedSkills = [...skillAnalytics].sort((a, b) => b.proficiency_score - a.proficiency_score);
    const strongestSkill = sortedSkills[0] || {
      id: 'default-str',
      user_id: userId,
      skill_category: 'Analytical Thinking',
      proficiency_score: 85,
      interviews_tested: 1,
      strongest_point: 'Consistent high performance',
      weakest_point: 'None identified',
      last_updated: new Date().toISOString(),
    };
    const weakestSkill = sortedSkills[sortedSkills.length - 1] || {
      id: 'default-weak',
      user_id: userId,
      skill_category: 'System Edge Cases',
      proficiency_score: 72,
      interviews_tested: 1,
      strongest_point: 'Solid baseline',
      weakest_point: 'Requires structured practice',
      last_updated: new Date().toISOString(),
    };

    return NextResponse.json({
      user,
      profile,
      stats: {
        totalInterviewsCompleted: totalCompleted,
        averageScore: avgScore,
        readinessPercentage,
        strongestSkill: {
          name: strongestSkill.skill_category,
          score: strongestSkill.proficiency_score,
          description: strongestSkill.strongest_point || 'Consistent high performance',
        },
        areasForImprovement: {
          name: weakestSkill.skill_category,
          score: weakestSkill.proficiency_score,
          description: weakestSkill.weakest_point || 'Requires structured practice',
        },
      },
      charts: {
        radarData,
        historyTrend,
      },
      recentInterviews: sessions.slice(0, 5),
      recommendations: recommendations.slice(0, 6),
      badges,
    });
  } catch (err: any) {
    console.error('Error fetching analytics:', err);
    return NextResponse.json({ error: err.message || 'Failed to load analytics' }, { status: 500 });
  }
}
