
import axios from "axios";

// India Jobs API
const INDIA_JOBS_API =
    "https://jobsforceindia.com/api/public/v1/jobs";

// International Remote Jobs API
const INTERNATIONAL_JOBS_API =
    "https://jobicy.com/api/jobs";

// Fetch India jobs
const fetchIndiaJobs = async (count) => {
    const pages = Math.ceil(count / 20);

    const requests = Array.from(
        { length: pages },
        (_, index) =>
            axios.get(INDIA_JOBS_API, {
                params: {
                    page: index + 1,
                    per_page: 20
                },
                timeout: 15000
            })
    );

    const responses = await Promise.all(requests);

    return responses.flatMap((response) => {
        const results = response.data.results || [];

        return results.map((job) => ({
            id: `india-${job.id}`,
            title: job.title || "Untitled Position",

            company:
                job.hiring?.display ||
                job.hiring?.name ||
                "Company Not Specified",

            companyLogo: "",
            location: [
                job.location?.city,
                job.location?.state,
                job.location?.country || "India"
            ].filter(Boolean).join(", "),

            type: job.job_type || "Not Specified",
            mode: job.work_mode || (
                job.location?.remote ? "remote" : "onsite"
            ),

            experience:
                job.experience?.label || "Not Specified",

            category: job.category || "General",
            description: job.summary || "No description available.",
            fullDescription: job.summary || "",

            url: job.apply_url || job.url,
            jobPageUrl: job.url,

            postedDate: job.posted_date || "",
            source: "India",
            region: "India",

            isFresher:
                job.experience?.fresher_friendly === true
        }));
    });
};

// Fetch international jobs
const fetchInternationalJobs = async (count) => {
    const response = await axios.get(
        INTERNATIONAL_JOBS_API,
        {
            params: { count },
            timeout: 15000,
            headers: {
                Accept: "application/json"
            }
        }
    );

    const jobs = response.data.jobs || [];

    const fresherKeywords = [
        "junior",
        "entry level",
        "entry-level",
        "graduate",
        "intern",
        "internship",
        "trainee",
        "associate",
        "fresher",
        "new grad"
    ];

    return jobs.map((job) => {
        const location = job.jobGeo || "Location Not Specified";

        const jobText = [
            job.jobTitle,
            job.jobLevel,
            job.jobExcerpt,
            job.jobDescription
        ].join(" ").toLowerCase();

        const isIndia = /\bindia\b/i.test(location);

        return {
            id: `international-${job.id}`,
            title: job.jobTitle || "Untitled Position",
            company: job.companyName || "Company Not Specified",
            companyLogo: job.companyLogo || "",
            location,

            type: Array.isArray(job.jobType)
                ? job.jobType.join(", ")
                : job.jobType || "Not Specified",

            mode: /remote/i.test(location)
                ? "remote"
                : "onsite",

            experience: job.jobLevel || "Not Specified",

            category: Array.isArray(job.jobIndustry)
                ? job.jobIndustry.join(", ")
                : job.jobIndustry || "General",

            description:
                job.jobExcerpt || "No description available.",

            fullDescription: job.jobDescription || "",
            url: job.url || "",
            jobPageUrl: job.url || "",
            postedDate: job.pubDate || "",

            source: "Jobicy",
            region: isIndia ? "India" : "International",

            isFresher: fresherKeywords.some((keyword) =>
                jobText.includes(keyword)
            )
        };
    });
};

// Main API Controller
export const getJobs = async (req, res) => {
    const count = Math.min(
        Math.max(Number(req.query.count) || 50, 1),
        200
    );

    const [indiaResult, internationalResult] =
        await Promise.allSettled([
            fetchIndiaJobs(count),
            fetchInternationalJobs(count)
        ]);

    const indiaJobs =
        indiaResult.status === "fulfilled"
            ? indiaResult.value
            : [];

    const internationalJobs =
        internationalResult.status === "fulfilled"
            ? internationalResult.value
            : [];

    if (
        indiaResult.status === "rejected" &&
        internationalResult.status === "rejected"
    ) {
        console.error(
            "India Jobs API Error:",
            indiaResult.reason?.message
        );

        console.error(
            "International Jobs API Error:",
            internationalResult.reason?.message
        );

        return res.status(502).json({
            success: false,
            message: "Unable to fetch job listings. Please try again later."
        });
    }

    // Keep India jobs first and remove duplicate IDs
    const allJobs = [
        ...indiaJobs,
        ...internationalJobs
    ];

    const uniqueJobs = Array.from(
        new Map(
            allJobs.map((job) => [job.id, job])
        ).values()
    );

    const fresherJobs = uniqueJobs.filter(
        (job) => job.isFresher
    );

    return res.status(200).json({
        success: true,
        count: uniqueJobs.length,

        indiaCount: uniqueJobs.filter(
            (job) => job.region === "India"
        ).length,

        internationalCount: uniqueJobs.filter(
            (job) => job.region === "International"
        ).length,

        fresherCount: fresherJobs.length,

        sources: {
            india: "JobsForce India",
            international: "Jobicy"
        },

        jobs: uniqueJobs,
        fresherJobs
    });
};
