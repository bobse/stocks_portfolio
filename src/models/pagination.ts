import mongoose from "mongoose";

interface paginatedResults {
  results: [];
  pagination: {
    totalCount: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

async function getPaginatedResults(
  model: mongoose.Model<T>,
  filter: mongoose.FilterQuery<T>,
  sort: any,
  limit: number | undefined,
  page: number | undefined
): Promise<paginatedResults> {
  if (!page) page = 1;
  if (!limit) limit = getDefaultLimit();

  const agg: mongoose.PipelineStage[] = [
    {
      $match: filter,
    },
    {
      $sort: sort,
    },
    {
      $facet: {
        results: [
          {
            $skip: (page - 1) * limit,
          },
          {
            $limit: limit,
          },
        ],
        pagination: [
          {
            $count: "totalCount",
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$pagination",
        preserveNullAndEmptyArrays: false,
      },
    },
  ];
  const results: Array<paginatedResults> = await model.aggregate(agg);
  if (results.length > 0) {
    const hasNext = results[0].pagination.totalCount > limit * page;
    const hasPrevious = page > 1;
    Object.assign(results[0].pagination, {
      limit: limit,
      page: page,
      hasNext: hasNext,
      hasPrevious: hasPrevious,
    });
    return results[0];
  }
  return {
    results: [],
    pagination: {
      totalCount: 0,
      page: 1,
      limit: limit,
      hasNext: false,
      hasPrevious: false,
    },
  };
}

function getDefaultLimit() {
  if (
    process.env.PAGINATION_LIMIT !== undefined &&
    !isNaN(+process.env.PAGINATION_LIMIT)
  ) {
    return +process.env.PAGINATION_LIMIT;
  } else {
    return 50;
  }
}

export { getPaginatedResults };
