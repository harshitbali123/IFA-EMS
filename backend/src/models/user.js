import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  roles: { type: [String], default: [] },  // e.g. ["employee", "admin"]
  name: String,
  picture: String,
  lastLogin: { type: Date, default: Date.now },
  
  status: {
    type: String,
    enum: ["approved", "pending", "rejected"],
    default:"approved",
  },
  
  // Profile completion fields
  profileCompleted: { type: Boolean, default: false },
  phoneNumber: String,
  dateOfBirth: Date,
  streetAddress: String,
  city: String,
  state: String,
  pincode: String,
  designation: String,
  department: String,
  joiningDate: Date,
  skills: [String], // Array of skills
  
   assignedProjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project"
    }
  ],
});

//  Only employees get assigned "pending"
userSchema.pre("save", function (next) {
  // Only set status to 'pending' for new employees if status is not explicitly set
  if (this.isNew && Array.isArray(this.roles) && this.roles.includes("employee")) {
    // Only set to pending if status is not already explicitly set
    // This allows the auth route to explicitly set status to "pending" without override
    if (this.status === undefined || this.status === null) {
      this.status = "pending";
    }
    // If status is "approved" (default), also set to pending for new employees
    if (this.status === "approved") {
      this.status = "pending";
    }
  }
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
