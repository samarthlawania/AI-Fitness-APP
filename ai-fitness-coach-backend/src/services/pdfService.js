import PDFDocument from 'pdfkit';
import { logger } from '../config/logger.js';

class PDFService {
  async generatePlanPDF(plan) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });

        // PDF Header
        doc.fontSize(24).text('AI Fitness Coach - Personal Plan', 50, 50);
        doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, 50, 80);
        
        let yPosition = 120;

        // User Info
        doc.fontSize(16).text('User Profile', 50, yPosition);
        yPosition += 30;
        doc.fontSize(12)
          .text(`Age: ${plan.age}`, 50, yPosition)
          .text(`Gender: ${plan.gender}`, 200, yPosition)
          .text(`Height: ${plan.height}cm`, 350, yPosition);
        yPosition += 20;
        doc.text(`Weight: ${plan.weight}kg`, 50, yPosition)
          .text(`Fitness Goal: ${plan.fitnessGoal}`, 200, yPosition)
          .text(`Level: ${plan.fitnessLevel}`, 350, yPosition);
        
        yPosition += 40;

        // Workout Plan
        doc.fontSize(16).text('Workout Plan', 50, yPosition);
        yPosition += 30;

        plan.workoutPlan.forEach((day, index) => {
          if (yPosition > 700) {
            doc.addPage();
            yPosition = 50;
          }

          doc.fontSize(14).text(`Day ${day.day}: ${day.dayName} - ${day.focus}`, 50, yPosition);
          yPosition += 20;

          day.exercises.forEach((exercise) => {
            if (yPosition > 720) {
              doc.addPage();
              yPosition = 50;
            }

            doc.fontSize(10)
              .text(`• ${exercise.name}: ${exercise.sets} sets x ${exercise.reps} reps`, 70, yPosition)
              .text(`  Rest: ${exercise.rest}`, 70, yPosition + 12);
            yPosition += 30;
          });

          yPosition += 10;
        });

        // Diet Plan
        if (yPosition > 600) {
          doc.addPage();
          yPosition = 50;
        }

        doc.fontSize(16).text('Diet Plan', 50, yPosition);
        yPosition += 30;

        plan.dietPlan.forEach((day) => {
          if (yPosition > 650) {
            doc.addPage();
            yPosition = 50;
          }

          doc.fontSize(14).text(`Day ${day.day}: ${day.dayName}`, 50, yPosition);
          yPosition += 20;

          day.meals.forEach((meal) => {
            if (yPosition > 720) {
              doc.addPage();
              yPosition = 50;
            }

            doc.fontSize(12).text(`${meal.type.toUpperCase()}: ${meal.name}`, 70, yPosition);
            doc.fontSize(10).text(`Calories: ${meal.calories} | Protein: ${meal.protein}g | Carbs: ${meal.carbs}g | Fat: ${meal.fat}g`, 70, yPosition + 15);
            yPosition += 35;
          });

          yPosition += 10;
        });

        // Metadata
        if (yPosition > 600) {
          doc.addPage();
          yPosition = 50;
        }

        doc.fontSize(16).text('Plan Summary', 50, yPosition);
        yPosition += 30;
        
        doc.fontSize(12)
          .text(`Daily Calories: ${plan.metadata.estimatedCaloriesPerDay}`, 50, yPosition)
          .text(`Difficulty: ${plan.metadata.difficultyLevel}`, 50, yPosition + 20)
          .text(`Equipment Needed: ${plan.metadata.equipmentNeeded?.join(', ') || 'None'}`, 50, yPosition + 40);

        if (plan.metadata.tips) {
          yPosition += 80;
          doc.fontSize(14).text('Tips:', 50, yPosition);
          yPosition += 20;
          
          plan.metadata.tips.forEach((tip) => {
            doc.fontSize(10).text(`• ${tip}`, 70, yPosition);
            yPosition += 15;
          });
        }

        doc.end();
      } catch (error) {
        logger.error('PDF generation error:', error);
        reject(error);
      }
    });
  }
}

export const pdfService = new PDFService();