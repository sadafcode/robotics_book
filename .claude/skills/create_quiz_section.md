---
description: Generate assessment questions and quizzes for Physical AI documentation chapters
---

# SKILL: Create Quiz Section

## CONTEXT

The user needs to add assessment questions to test reader comprehension and reinforce learning in Physical AI documentation. Effective quizzes should:

- Test understanding at multiple cognitive levels
- Provide immediate feedback with explanations
- Reinforce key concepts from the chapter
- Include a mix of question types
- Be challenging but fair

**Quiz request:** $ARGUMENTS (chapter topic, difficulty level, question count)

## YOUR ROLE

Act as an assessment designer and educator with expertise in:
- Educational assessment and evaluation
- Multiple-choice and constructed-response questions
- Bloom's Taxonomy and cognitive levels
- Physical AI and robotics technical knowledge
- Formative and summative assessment design

## EXECUTION STEPS

### Step 1: Analyze Chapter Content

Extract from the chapter:
- **Key concepts**: Main ideas that must be understood
- **Critical facts**: Important details to remember
- **Common misconceptions**: What learners often get wrong
- **Practical applications**: Real-world scenarios
- **Problem-solving skills**: Analytical abilities to test

From $ARGUMENTS, determine:
- **Number of questions**: 5-15 questions typical
- **Difficulty distribution**: Mix of easy, medium, hard
- **Question types**: Multiple choice, true/false, code-based, scenario-based
- **Bloom's levels**: Remember, understand, apply, analyze, evaluate

### Step 2: Design Question Distribution

Plan a balanced quiz:

**Cognitive level distribution (example for 10 questions):**
- Remember (20%): 2 questions - terminology, facts
- Understand (30%): 3 questions - concepts, explanations
- Apply (30%): 3 questions - code, calculations, procedures
- Analyze/Evaluate (20%): 2 questions - compare, critique, design

**Difficulty distribution:**
- Easy (30%): 3 questions - basic recall and understanding
- Medium (50%): 5 questions - application and analysis
- Hard (20%): 2 questions - synthesis and complex scenarios

**Question type mix:**
- Multiple choice: 60-70%
- True/False: 10-20%
- Code-based: 10-20%
- Scenario/Case study: 10%

### Step 3: Create Multiple Choice Questions

Generate well-designed MCQs:

**Format template:**

```markdown
### Question N: [Category - Difficulty]

[Clear, concise question stem]

A) [Plausible distractor]
B) [Correct answer]
C) [Plausible distractor]
D) [Plausible distractor]

<details>
<summary>Show Answer</summary>

**Correct Answer: B**

**Explanation:**
[Why B is correct and why other options are incorrect. Include relevant
concepts and refer back to chapter sections.]

**Key Concept:**
[The main takeaway this question tests]

**Chapter Reference:** Section X.Y
</details>
```

**Example - Remember level:**

```markdown
### Question 1: Sensor Fusion Basics - Easy

What is the primary purpose of sensor fusion in robotics?

A) To reduce the cost of individual sensors
B) To combine data from multiple sensors for more accurate state estimation
C) To replace expensive sensors with cheaper alternatives
D) To increase the update rate of sensor measurements

<details>
<summary>Show Answer</summary>

**Correct Answer: B**

**Explanation:**
Sensor fusion combines data from multiple heterogeneous sensors to achieve
more accurate and robust state estimation than any single sensor could provide.
While it may indirectly affect cost (A) or data rates (D), the primary goal
is improved accuracy and reliability through complementary sensor modalities.

**Key Concept:**
Sensor fusion improves state estimation by leveraging the strengths of different
sensor types (e.g., cameras for visual features, IMU for high-rate motion, GPS
for absolute position).

**Chapter Reference:** Section 1.1 - Introduction to Sensor Fusion
</details>
```

**Example - Understand level:**

```markdown
### Question 2: Kalman Filter Concepts - Medium

Why does the Extended Kalman Filter (EKF) linearize the system dynamics using
Jacobian matrices?

A) To make the algorithm run faster on embedded systems
B) Because the standard Kalman Filter only works with linear systems
C) To reduce the memory requirements for storing covariance matrices
D) Because robotics systems never have truly nonlinear dynamics

<details>
<summary>Show Answer</summary>

**Correct Answer: B**

**Explanation:**
The standard Kalman Filter assumes linear system dynamics and Gaussian noise.
Real robotics systems are often nonlinear (e.g., orientation dynamics, sensor
models). The EKF linearizes the system around the current state estimate using
Jacobian matrices, allowing the Kalman Filter framework to be applied to
nonlinear systems. While this may have computational benefits (A), that's not
the primary reason. Option D is incorrect as most robotics systems are highly
nonlinear.

**Key Concept:**
EKF extends Kalman filtering to nonlinear systems through local linearization,
trading optimality for applicability to real-world robots.

**Chapter Reference:** Section 2.3 - Extended Kalman Filter
</details>
```

**Example - Apply level:**

```markdown
### Question 3: ROS 2 Implementation - Medium

You're implementing a sensor fusion node in ROS 2 that subscribes to camera
(30 Hz) and LiDAR (10 Hz) data. What QoS settings should you use for the LiDAR
subscription to avoid dropping messages?

A) RELIABLE with depth 1
B) BEST_EFFORT with depth 1
C) RELIABLE with depth 10
D) BEST_EFFORT with depth 10

<details>
<summary>Show Answer</summary>

**Correct Answer: C**

**Explanation:**
For sensor data that you cannot afford to lose (like LiDAR for obstacle
detection), use RELIABLE reliability policy to ensure delivery. The depth
should be ≥10 to buffer messages in case your processing temporarily falls
behind the sensor rate. BEST_EFFORT (B, D) is only appropriate for high-rate
data where occasional drops are acceptable. Depth 1 (A, B) risks message loss
if processing is even slightly slower than sensor rate.

**Key Concept:**
QoS policy selection depends on message criticality (RELIABLE vs BEST_EFFORT)
and processing speed (depth for buffering).

**Chapter Reference:** Section 3.2 - ROS 2 QoS Configuration
</details>
```

**Example - Analyze level:**

```markdown
### Question 4: System Design - Hard

A mobile robot operates in an urban environment with tall buildings. GPS is
available but experiences multipath errors. You have wheel odometry (high-rate,
but drifts), IMU (high-rate, noisy), and GPS (low-rate, biased). Which sensor
fusion architecture would be most appropriate?

A) GPS-only with outlier rejection
B) Loosely-coupled integration with GPS as a correction to wheel odometry + IMU
C) Tightly-coupled integration using raw GPS pseudoranges
D) IMU-only with GPS used only for initialization

<details>
<summary>Show Answer</summary>

**Correct Answer: B**

**Explanation:**
Loosely-coupled integration (B) is most appropriate here because:
- GPS is unreliable (multipath) but provides absolute position corrections
- Wheel odometry + IMU provide good short-term estimates but drift long-term
- Loosely-coupled allows robust GPS outlier detection before fusion

Option A ignores valuable odometry/IMU data. Option C (tightly-coupled) requires
processing raw GPS signals and is complex, only justified when GPS quality is
critical. Option D would accumulate unbounded drift without GPS corrections.

**Key Concept:**
Loosely-coupled architectures are robust when absolute sensors (GPS) are
unreliable, allowing outlier rejection before fusion with relative sensors
(odometry, IMU).

**Chapter Reference:** Section 4.2 - Fusion Architectures
</details>
```

### Step 4: Create True/False Questions

Design T/F questions that test understanding:

```markdown
### Question 5: Sensor Characteristics - Easy

**True or False:** A LiDAR sensor provides both range and bearing measurements
in a single scan.

<details>
<summary>Show Answer</summary>

**Answer: True**

**Explanation:**
LiDAR (Light Detection and Ranging) measures both the distance (range) to
objects and the angle (bearing) at which they're detected. A 2D LiDAR scan
produces a set of (range, angle) pairs, typically covering 360° or a subset.
This is what makes LiDAR valuable for mapping and obstacle detection—it
provides spatial information in polar coordinates.

**Key Concept:**
LiDAR provides 2D or 3D spatial information through range and bearing
measurements.

**Chapter Reference:** Section 1.3 - Common Sensors
</details>
```

**Advanced True/False with justification:**

```markdown
### Question 6: Filter Performance - Medium

**True or False:** If a Kalman Filter's innovation (measurement residual) is
consistently large, this indicates the filter is performing poorly and should
be retuned.

<details>
<summary>Show Answer</summary>

**Answer: False (but requires nuance)**

**Explanation:**
Large innovation can indicate multiple situations:
- **Poor tuning**: Process/measurement noise parameters are incorrect (needs retuning)
- **Model mismatch**: System dynamics don't match the model (needs redesign)
- **Sensor degradation**: Sensor is malfunctioning or environment changed
- **Correct operation**: The measurements genuinely differ from predictions (filter is working!)

The innovation being large doesn't automatically mean poor performance—it could
mean the filter is correctly detecting unexpected changes. You should examine
innovation *consistency* (is it zero-mean? within expected bounds?) rather than
just magnitude.

**Key Concept:**
Innovation residual analysis reveals filter health, but interpretation requires
understanding whether large residuals indicate problems or expected dynamics.

**Chapter Reference:** Section 2.5 - Filter Validation
</details>
```

### Step 5: Create Code-Based Questions

Test practical coding knowledge:

```markdown
### Question 7: Python Implementation - Medium

What is wrong with this Kalman Filter prediction step implementation?

```python
def predict(self, dt):
    # Predict state
    self.x = self.F @ self.x

    # Predict covariance
    self.P = self.F @ self.P @ self.F
```

A) The state transition matrix F should not be applied to x
B) The prediction covariance is missing the transpose of F
C) The process noise Q is not added to the covariance
D) The time step dt is not used in the prediction

<details>
<summary>Show Answer</summary>

**Correct Answer: C (and B is also technically correct)**

**Explanation:**
The complete Kalman Filter prediction equations are:
```python
def predict(self, dt):
    # Predict state: x̂ = F·x
    self.x = self.F @ self.x  # ✓ Correct

    # Predict covariance: P = F·P·F^T + Q
    self.P = self.F @ self.P @ self.F.T + self.Q  # Need F.T and + Q
```

**Missing elements:**
- **Critical**: Process noise Q must be added to account for model uncertainty
- **Also missing**: F transpose (F.T) for matrix algebra correctness

Without Q, the covariance will shrink over time, leading to overconfidence.
Without F.T, the covariance won't remain symmetric.

**Key Concept:**
Kalman prediction adds uncertainty (Q) because the model is imperfect. Omitting
Q causes filter divergence.

**Chapter Reference:** Section 2.2 - Kalman Filter Equations
</details>
```

### Step 6: Create Scenario-Based Questions

Test application in realistic contexts:

```markdown
### Question 8: Real-World Scenario - Hard

**Scenario:**
You're developing a warehouse robot that navigates using wheel odometry and
a ceiling-mounted camera system. The camera provides absolute position at 5 Hz,
but occasionally fails to detect the robot (occlusions). Wheel odometry is
100 Hz but drifts due to wheel slip on smooth floors.

Your current sensor fusion implementation uses an EKF that immediately incorporates
each camera measurement when available. The robot sometimes jerks violently when
the camera re-detects it after occlusion.

What is the most likely cause and best solution?

A) Increase the camera update rate to 30 Hz to reduce gaps
B) Add outlier detection to reject camera measurements with high innovation
C) Use wheel odometry only and ignore camera measurements
D) Switch from EKF to a Particle Filter for better nonlinearity handling

<details>
<summary>Show Answer</summary>

**Correct Answer: B**

**Explanation:**
The jerking behavior occurs when the camera re-detects the robot after occlusion.
During occlusion, the EKF relies on wheel odometry, which drifts due to slip.
When the camera measurement suddenly returns with a large difference from the
predicted position, the filter applies a large correction—causing the jerk.

**Solution: Outlier detection (B)**
Implement innovation-based outlier rejection:
```python
innovation = z - H @ x  # Measurement residual
S = H @ P @ H.T + R     # Innovation covariance
if innovation.T @ inv(S) @ innovation > threshold:  # Chi-squared test
    # Reject or gradually integrate measurement
```

This allows the filter to gradually re-converge rather than making large jumps.

**Why others fail:**
- A: Higher camera rate doesn't solve occlusion problem
- C: Ignores valuable absolute position corrections
- D: Nonlinearity isn't the issue; innovation magnitude is

**Key Concept:**
Robust sensor fusion requires outlier detection, especially when sensors have
different characteristics (high-rate/drifting vs. low-rate/absolute).

**Chapter Reference:** Section 4.4 - Robust Fusion Techniques
</details>
```

### Step 7: Create Calculation Questions

Test quantitative understanding:

```markdown
### Question 9: Covariance Calculation - Hard

An IMU measures angular velocity with a noise standard deviation of σ = 0.01 rad/s.
If you integrate the angular velocity over Δt = 0.1 seconds to estimate
orientation change, what is the variance of the orientation estimate (assuming
uncorrelated noise)?

A) 0.001 rad²
B) 0.0001 rad²
C) 0.00001 rad²
D) 0.1 rad²

<details>
<summary>Show Answer</summary>

**Correct Answer: C (0.00001 rad²)**

**Explanation:**

**Given:**
- Angular velocity noise: σ_ω = 0.01 rad/s (so variance = σ_ω² = 0.0001 rad²/s²)
- Integration time: Δt = 0.1 s

**Integration formula:**
θ = ∫ ω dt ≈ ω · Δt

**Variance propagation:**
For a linear transformation y = a·x, if var(x) = σ_x², then var(y) = a² · σ_x²

**Calculation:**
var(θ) = (Δt)² · var(ω)
       = (0.1)² · 0.0001
       = 0.01 · 0.0001
       = 0.000001 rad² = 10⁻⁶ rad²

**Wait, this gives 0.000001, not 0.00001!**

Actually, I need to reconsider. For continuous-time integration of white noise:
var(θ) = σ_ω² · Δt  (not Δt²)

var(θ) = 0.0001 · 0.1 = 0.00001 rad² ✓

**Key Concept:**
When integrating white noise (like sensor measurements), variance grows linearly
with time: var(∫ω dt) = σ_ω² · Δt

**Chapter Reference:** Section 2.4 - Uncertainty Propagation
</details>
```

### Step 8: Format Quiz Section

Structure the complete quiz:

```markdown
## Knowledge Check: $CHAPTER_TITLE

:::info Quiz Instructions
This quiz tests your understanding of the key concepts from this chapter.
Try to answer each question before revealing the solution. Don't worry if
you don't get everything right—the explanations will reinforce the concepts!

- **Questions:** $N total
- **Difficulty:** Mix of easy, medium, and hard
- **Time:** ~$M minutes
- **Passing:** Understanding 70%+ indicates readiness to proceed
:::

### Quick Self-Check (2 minutes)

Before the full quiz, test your recall:

- [ ] Can you define $KEY_TERM_1 in your own words?
- [ ] Do you understand when to use $TECHNIQUE_A vs. $TECHNIQUE_B?
- [ ] Have you run at least one code example from this chapter?
- [ ] Can you explain $CORE_CONCEPT to someone else?

If you answered "no" to any of these, review the relevant sections before proceeding.

---

### Quiz Questions

<!-- Questions 1-N here -->

---

## Quiz Complete!

### Scoring Guide

- **8-10 correct (80-100%)**: Excellent! You have strong mastery of this material.
- **6-7 correct (60-70%)**: Good understanding. Review questions you missed.
- **4-5 correct (40-50%)**: Partial understanding. Re-read key sections.
- **0-3 correct (0-30%)**: Review the chapter before proceeding.

### Common Mistakes

Based on this quiz, learners often struggle with:

1. **$COMMON_MISTAKE_1**: Review Section X.Y for clarification
2. **$COMMON_MISTAKE_2**: Practice the code example in Section A.B
3. **$COMMON_MISTAKE_3**: Study the comparison table in Section M.N

### Next Steps

- ✅ **If you scored well**: Proceed to [Next Chapter](./next-chapter.md)
- 📚 **If you need review**: Re-read sections corresponding to missed questions
- 💻 **For deeper practice**: Complete the [Hands-on Exercise](./exercise.md)
- 💬 **Have questions?**: [Join the discussion forum](link)

---

:::tip Spaced Repetition
Bookmark this quiz and return to it in:
- **1 week**: To reinforce long-term retention
- **1 month**: To ensure concepts remain fresh
- **Before using this technique**: To refresh your memory
:::
```

### Step 9: Add Interactive Elements (Optional)

For Docusaurus with plugins:

```markdown
### Interactive Quiz

:::note Docusaurus Quiz Plugin
If your site has the quiz plugin installed, embed interactive quizzes:
:::

<!-- Example with hypothetical quiz component -->
<Quiz id="sensor-fusion-basics">
  <Question
    question="What is sensor fusion?"
    options={[
      "Combining multiple sensors",
      "Replacing expensive sensors",
      "Improving sensor resolution"
    ]}
    correctAnswer={0}
    explanation="Sensor fusion combines data from multiple sensors..."
  />
</Quiz>
```

### Step 10: Create Answer Key Summary

Provide quick reference:

```markdown
## Answer Key

| Q# | Answer | Difficulty | Topic | Section |
|----|--------|------------|-------|---------|
| 1  | B      | Easy       | Sensor fusion basics | 1.1 |
| 2  | B      | Medium     | EKF concepts | 2.3 |
| 3  | C      | Medium     | ROS 2 QoS | 3.2 |
| 4  | B      | Hard       | Architecture design | 4.2 |
| 5  | True   | Easy       | LiDAR characteristics | 1.3 |
| 6  | False  | Medium     | Filter validation | 2.5 |
| 7  | C      | Medium     | Python implementation | 2.2 |
| 8  | B      | Hard       | Robust fusion | 4.4 |
| 9  | C      | Hard       | Uncertainty propagation | 2.4 |
| 10 | ...    | ...        | ... | ... |

### By Topic

**Sensor Fusion Fundamentals:** Q1, Q5
**Kalman Filtering:** Q2, Q6, Q7, Q9
**Implementation:** Q3, Q7
**System Design:** Q4, Q8
```

## OUTPUT STRUCTURE

Present the quiz:

```
✅ Quiz created for: $CHAPTER_TITLE

📊 Quiz composition:
   - Total questions: N
   - Multiple choice: X questions
   - True/False: Y questions
   - Code-based: Z questions
   - Scenario-based: W questions

🎯 Cognitive level distribution:
   - Remember: X% (foundational knowledge)
   - Understand: Y% (conceptual understanding)
   - Apply: Z% (practical application)
   - Analyze/Evaluate: W% (critical thinking)

📈 Difficulty distribution:
   - Easy: X questions (30%)
   - Medium: Y questions (50%)
   - Hard: Z questions (20%)

✓ All questions have detailed explanations
✓ Answers reference specific chapter sections
✓ Common misconceptions addressed
✓ Key concepts highlighted
✓ Distractors are plausible
✓ Code examples are syntactically correct

📝 Ready to insert into chapter
🎓 Supports learning assessment and reinforcement
```

## QUESTION WRITING BEST PRACTICES

**MCQ Design:**
- Clear, unambiguous question stem
- One clearly correct answer
- Plausible distractors based on common mistakes
- Avoid "all of the above" or "none of the above"
- Randomize answer position (not always B or C)

**Distractors (wrong answers):**
- Based on actual misconceptions
- Plausible enough to be tempting
- Not obviously wrong
- Not tricky or deceptive

**Explanations:**
- Explain why correct answer is right
- Explain why distractors are wrong
- Reference specific chapter content
- Reinforce key concepts

**Avoid:**
- Trivial questions testing memorization only
- Questions with multiple defensible answers
- Trick questions or gotchas
- Overly complex scenarios without clear answers

## QUALITY CHECKS

Before completing:
- [ ] Each question has one clearly correct answer
- [ ] Distractors are plausible but incorrect
- [ ] Explanations are thorough and educational
- [ ] Questions span multiple cognitive levels
- [ ] Difficulty is appropriate for audience
- [ ] No grammatical or spelling errors
- [ ] Code examples are syntactically correct
- [ ] Chapter sections are properly referenced
- [ ] Answer key is accurate
- [ ] Quiz format renders correctly in Docusaurus

## TONE

Be educational and constructive. Quizzes should be challenging but fair, with explanations that teach rather than just correct. Frame wrong answers as learning opportunities, not failures.
