export const success = (res, status) => (entity) => {
  if (entity) {
    res.status(status || 200).json({
      code: 200,
      message: "success",
      count: entity.count,
      data: entity.rows,
    });
  }
  return null;
};

export const notFound = (res) => (entity) => {
  if (entity) {
    return entity;
  }
  res.status(404).json({
    code: 404,
    message: "not Found",
  });
  return null;
};

export const authorOrAdmin = (res, user, userField) => (entity) => {
  if (entity) {
    const isAdmin = user.role === "admin";
    const isAuthor = entity[userField] && entity[userField].equals(user.id);
    if (isAuthor || isAdmin) {
      return entity;
    }
    res.status(401).json({
      code: 401,
      message: "Unauthorized",
    });
  }
  return null;
};

export const responseError = (res, message) => {
  return res.status(400).json({
    code: 400,
    message: message ? message : "Bad Request",
  });
};

export const responseUnauthorized = (res, message) => {
  return res.status(401).json({
    code: 401,
    message: message ? message : "Unauthorized",
  });
};

export const responseSuccess = (res, message, data) => {
  return res.status(200).json({
    code: 200,
    message: message ? message : "Unauthorized",
    data: data || null,
  });
};
