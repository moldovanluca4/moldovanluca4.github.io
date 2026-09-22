#!/usr/bin/env python3
"""
Generate a professional, high-fidelity PDF Curriculum Vitae for Luca Moldovan.
Uses pycairo to render vector text, rules, badges, and layout.
"""

import cairo

def create_cv_pdf(filename="files/cv.pdf"):
    # A4 Dimensions in points (72 points/inch)
    width = 595.28
    height = 841.89
    
    surface = cairo.PDFSurface(filename, width, height)
    ctx = cairo.Context(surface)
    
    # Clean background
    ctx.set_source_rgb(1.0, 1.0, 1.0)
    ctx.paint()
    
    margin_x = 44.0
    content_width = width - (margin_x * 2)
    y = 38.0
    
    # Palette
    color_primary = (0.07, 0.11, 0.18)     # Deep dark #111827
    color_accent = (0.10, 0.45, 0.90)      # Professional blue #1a73e8
    color_sub = (0.22, 0.30, 0.41)         # Dark slate
    color_text = (0.24, 0.29, 0.36)        # Charcoal #374151
    color_muted = (0.42, 0.48, 0.56)       # Gray #6b7280
    color_rule = (0.85, 0.88, 0.93)        # Light border
    
    def set_font(family="Helvetica", bold=False, size=10):
        weight = cairo.FONT_WEIGHT_BOLD if bold else cairo.FONT_WEIGHT_NORMAL
        ctx.select_font_face(family, cairo.FONT_SLANT_NORMAL, weight)
        ctx.set_font_size(size)

    # 1. HEADER
    set_font(bold=True, size=23)
    ctx.set_source_rgb(*color_primary)
    ctx.move_to(margin_x, y + 18)
    ctx.show_text("Luca Moldovan")
    
    set_font(bold=False, size=10.5)
    ctx.set_source_rgb(*color_accent)
    ctx.move_to(margin_x, y + 33)
    ctx.show_text("Computer Science Student  •  Bioinformatics & Systems Enthusiast")
    
    # Contact Row
    set_font(bold=False, size=8.5)
    ctx.set_source_rgb(*color_muted)
    contact_text = "Bremen, Germany  |  moldovanluca1605@gmail.com  |  linkedin.com/in/luca-moldovan  |  github.com/moldovanluca4"
    ctx.move_to(margin_x, y + 46)
    ctx.show_text(contact_text)
    
    y += 54
    
    # Subtle top divider
    ctx.set_source_rgb(*color_accent)
    ctx.set_line_width(1.5)
    ctx.move_to(margin_x, y)
    ctx.line_to(margin_x + 55, y)
    ctx.stroke()

    ctx.set_source_rgb(*color_rule)
    ctx.set_line_width(0.8)
    ctx.move_to(margin_x + 55, y)
    ctx.line_to(margin_x + content_width, y)
    ctx.stroke()
    
    y += 12

    def draw_section_header(title):
        nonlocal y
        set_font(bold=True, size=10)
        ctx.set_source_rgb(*color_accent)
        ctx.move_to(margin_x, y + 8)
        ctx.show_text(title.upper())
        
        text_extents = ctx.text_extents(title.upper())
        rule_start = margin_x + text_extents.width + 10
        ctx.set_source_rgb(*color_rule)
        ctx.set_line_width(0.75)
        ctx.move_to(rule_start, y + 5)
        ctx.line_to(margin_x + content_width, y + 5)
        ctx.stroke()
        y += 16

    # 2. PROFILE SUMMARY
    draw_section_header("Executive Summary")
    set_font(bold=False, size=8.5)
    ctx.set_source_rgb(*color_text)
    summary_lines = [
        "Computer Science student at Constructor University with a Mathematics minor. Recently wrapped up a fantastic research",
        "internship at the University of Calgary focusing on genomics representation learning and disease prediction. Dedicated to systems",
        "programming, deep learning, operating systems, and high-performance computing, actively preparing for master's degree studies",
        "and future opportunities to work, grow, and innovate."
    ]
    for line in summary_lines:
        ctx.move_to(margin_x, y + 7)
        ctx.show_text(line)
        y += 11.5
    
    y += 4

    # 3. EDUCATION
    draw_section_header("Education")
    
    set_font(bold=True, size=9.5)
    ctx.set_source_rgb(*color_primary)
    ctx.move_to(margin_x, y + 7)
    ctx.show_text("Constructor University")
    
    set_font(bold=False, size=8.5)
    ctx.set_source_rgb(*color_muted)
    date_str = "Bremen, Germany  |  Sep 2024 - Jun 2027 (Expected)"
    ext = ctx.text_extents(date_str)
    ctx.move_to(margin_x + content_width - ext.width, y + 7)
    ctx.show_text(date_str)
    
    set_font(bold=False, size=8.5)
    ctx.set_source_rgb(*color_sub)
    ctx.move_to(margin_x, y + 19)
    ctx.show_text("Bachelor of Science in Computer Science, Minor in Mathematics")
    y += 27

    # 4. EXPERIENCE
    draw_section_header("Experience")

    experiences = [
        {
            "role": "Research Intern — Genomics & Bioinformatics",
            "org": "University of Calgary",
            "location": "Calgary, AB, Canada",
            "dates": "Jun 2026 - Aug 2026",
            "bullets": [
                "Awarded 2026 Mitacs Globalink Research Internship & DAAD-RISE Worldwide Scholarship in Dr. Long's lab.",
                "Researched deep learning representations for high-dimensional genomics data to characterize biology and predict diseases.",
                "Orchestrated large-scale multi-GPU model training workflows on the Advanced Research Computing (ARC) cluster platform.",
                "Acquired deep knowledge of molecular biology, bioinformatics algorithms, and cross-disciplinary biomedical workflows."
            ]
        },
        {
            "role": "Teaching Assistant — Elements of Calculus",
            "org": "Constructor University",
            "location": "Bremen, Germany",
            "dates": "Feb 2026 - Jun 2026",
            "bullets": [
                "Mentored undergraduate students through core mathematical concepts, multivariable calculus, and formal proofs.",
                "Conducted tutorial sessions, led weekly exercise discussions, and graded assignments with comprehensive feedback."
            ]
        },
        {
            "role": "Software Development Intern",
            "org": "Living Mainframe",
            "location": "Boeblingen, Germany",
            "dates": "Jun 2025 - Jul 2025",
            "bullets": [
                "Collaborated on enterprise mainframe solutions, z/OS operating environments, automation scripts, and tooling.",
                "Gained hands-on experience in mission-critical software architectures and low-level system workflows."
            ]
        },
        {
            "role": "Former IBM Z Student Ambassador",
            "org": "IBM Z Student Ambassador Program",
            "location": "Constructor University / Boeblingen, Germany",
            "dates": "Mar 2025 - Jun 2026",
            "bullets": [
                "Selected as guest speaker at AMC Young Talents Mainframe Convention 2025 ('Enhancing Skills with IBM Z XPLORE').",
                "Led campus workshops, hackathons, and technical sessions promoting mainframe architecture and enterprise computing."
            ]
        }
    ]

    for exp in experiences:
        # Row 1: Role on left, Dates on right
        set_font(bold=True, size=9.5)
        ctx.set_source_rgb(*color_primary)
        ctx.move_to(margin_x, y + 7)
        ctx.show_text(exp["role"])
        
        set_font(bold=False, size=8.5)
        ctx.set_source_rgb(*color_muted)
        d_ext = ctx.text_extents(exp["dates"])
        ctx.move_to(margin_x + content_width - d_ext.width, y + 7)
        ctx.show_text(exp["dates"])
        
        # Row 2: Org & Location
        set_font(bold=False, size=8.5)
        ctx.set_source_rgb(*color_sub)
        ctx.move_to(margin_x, y + 18)
        ctx.show_text(f"{exp['org']}  •  {exp['location']}")
        
        y += 24
        set_font(bold=False, size=8.2)
        ctx.set_source_rgb(*color_text)
        for b in exp["bullets"]:
            ctx.move_to(margin_x + 4, y + 5)
            ctx.show_text("•")
            ctx.move_to(margin_x + 14, y + 5)
            ctx.show_text(b)
            y += 11
        y += 3

    # 5. TECHNICAL SKILLS
    draw_section_header("Technical Skills")
    skills_data = [
        ("Programming Languages", "C, C++, Python, Bash / Shell Scripting, SQL, HTML5 / CSS3, JavaScript"),
        ("Systems & Platforms", "Linux / UNIX, Git, Docker, OpenMediaVault (OMV Homelab), High-Performance Computing (ARC), z/OS"),
        ("Domains & Topics", "Deep Learning (PyTorch), Bioinformatics Workflows, Genomics Representation Learning, Operating Systems")
    ]
    for cat, items in skills_data:
        set_font(bold=True, size=8.5)
        ctx.set_source_rgb(*color_primary)
        ctx.move_to(margin_x, y + 6)
        ctx.show_text(f"{cat}: ")
        cat_w = ctx.text_extents(f"{cat}: ").width
        
        set_font(bold=False, size=8.5)
        ctx.set_source_rgb(*color_text)
        ctx.move_to(margin_x + cat_w + 4, y + 6)
        ctx.show_text(items)
        y += 12

    y += 4

    # 6. HONORS & LEADERSHIP
    draw_section_header("Honors, Awards & Extracurricular")
    honors = [
        ("Mitacs Globalink Research Internship Award (2026)", "Competitive international research scholarship funded by Mitacs Canada"),
        ("DAAD-RISE Worldwide Scholarship Recipient (2026)", "German Academic Exchange Service grant for research at University of Calgary"),
        ("AMC Young Talents Mainframe Convention 2025", "Invited speaker on enterprise modernization and mainframe technologies"),
        ("Erasmus+ Youth Exchange Coordinator & Member", "Led and coordinated 4 youth projects with Landessportjugend Sachsen-Anhalt")
    ]
    for title, desc in honors:
        set_font(bold=True, size=8.5)
        ctx.set_source_rgb(*color_primary)
        ctx.move_to(margin_x + 4, y + 6)
        ctx.show_text("•")
        ctx.move_to(margin_x + 14, y + 6)
        ctx.show_text(f"{title}: ")
        tw = ctx.text_extents(f"{title}: ").width
        
        set_font(bold=False, size=8.5)
        ctx.set_source_rgb(*color_muted)
        ctx.move_to(margin_x + 14 + tw + 3, y + 6)
        ctx.show_text(desc)
        y += 12

    surface.finish()
    print(f"Successfully generated {filename}")

if __name__ == "__main__":
    create_cv_pdf()
