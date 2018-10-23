var mongoose = require('mongoose');

var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Schema = mongoose.Schema;

var coachingSchema = mongoose.Schema({
    type: {type: String, default:'Coaching'},
    name: {type: String,required: true},
    description: {type: String},
    group: { type: Schema.ObjectId, ref: 'group' },
    groupName: {type: String},
    groupChecked: {type: Boolean,default: false},
    coachingWebsite: String,
    ebbadgelink: [String],
    website: [String],
    otherlistings: [String],
    newwebsite: [String],
    facebookPage: String,
    twitter: String,
    youtubeChannel: String,
    //fbpage: String,
    email: [String],
    address: String,
    mapAddress: String,
    latlng: {
        lat: String,
        lng: String
    },
    //wide latlng is based on the last 2 parts of the address, city pair
    widelatlng: {
        lat: String,
        lng: String
    },
    loc: {
        type: { type: String },
        coordinates: []
    },
    //should be longitude, then latitude
    latlngna: Boolean,
    area: String,
    location: { type: Schema.ObjectId, ref: 'location' },
    city: String,
    cityslug: String,
    state: String,
    pincode: String,
    logoChecked:{type: Boolean,default: false},
    checkMobile:{type: Boolean,default: false},
    logo: String,
    mocktestcoverphoto: String,
    newlogo: String,
    logoBackup: String,
    oldlogo: String,
    mobile: [String],
    phone: [String],
    listingSnapshot: String,
    results:[{
        exam: {type: Schema.ObjectId, ref: 'exam'},
        year: {type: String},
        name: {type: String},
        category: {type: String},
        rank: {type: String},
        subgroup: {type: String},
        percentile: {type: String},
        percentage: {type: String},
        marks: {type: String},
        passFail: {type: String},
        active: {type: Boolean,default: true},
        course: {type: Schema.ObjectId, ref: 'course'},
        image: {type: String},
        _added: { type: Date, default: Date.now }
    }],
    course:[{
        exam: {type: Schema.ObjectId, ref: 'exam'},
        duration: {type: String},
        name: {type: String,required: true},
        nSeats: {type: String},
        hoursPerWeek: {type: String},
        entranceCriteria: {type: String},
        fees: {type: String},
        feeType: {type: String},
        mode: {type: String},
        idealFor: {type: String, default:''},
        eligibility: {type: String, default:''},
        _added: { type: Date, default: Date.now }
    }],
    photo:[{
        image: {type: String,unique: true},
        title: {type: String,default:''},
        description: {type: String,default:''},
        active: {type: Boolean,default: true},
        tags: [{ type: Schema.ObjectId, ref: 'mediaTag' }],
        _added: { type: Date, default: Date.now }
    }],
    video:[{
        link: {type: String,unique: true},
        description: String,
        active: {type: Boolean,default: true},
        tags: [{ type: Schema.ObjectId, ref: 'mediaTag' }],
        _added: { type: Date, default: Date.now }
    }],
    faculty:[{
        name: String,
        image: {type: String,unique: true},
        active: {type: Boolean,default: true},
        subject: String,
        yearsExperience: String,
        qualification: String,
        description: String,
        exams: [{ type: Schema.ObjectId, ref: 'exam' }],
        tags: [{ type: Schema.ObjectId, ref: 'mediaTag' }],
        _added: { type: Date, default: Date.now }
        /* 
        number seats
        eligibility
          class
          cleared exam
        */
    }],
    primaryManagement:{
        name: {type: String},
        role: {type: String},
        mobile: {type: String},
        email: {type: String},
    },
    management:[{
        name: {type: String,required: true},
        role: {type: String},
        mobile: {type: String,required: true,unique: true},
        email: {type: String},
    }],
    coursesOffered: [String],
    exams: [{ type: Schema.ObjectId, ref: 'exam' }],
    disabled: {type: Boolean,default: false},
    ebVerifyState: {type: String},
    ebVerify: [{
        state: String,
        user: { type: Schema.ObjectId, ref: 'User' },
        _added: { type: Date, default: Date.now }
    }],
    verfiyAssigned: {type: Boolean,default: false},
    addContactInfoAssigned: {type: Boolean,default: false},
    addContactInfoRequired: {type: Boolean,default: true},
    addContactInfoDone: {type: Boolean,default: false},
    contactInfoState: {type: String},
    rank: {type: Number,default: 0},
    fillable: {type: Boolean,default: false},
    ebNote: [{
        note: String,
        user: { type: Schema.ObjectId, ref: 'User' },
        _added: { type: Date, default: Date.now }
    }],
    interested: [{
        user: { type: Schema.ObjectId, ref: 'User' },
        active: {type: Boolean,default: true},
        _date: { type: Date, default: Date.now }
    }],
    _saved:[{
        user: { type: Schema.ObjectId, ref: 'user' },
        _time: { type: Date, default: Date.now }
    }],
    _created: { type: Date, default: Date.now },
    _createdBy: { type: Schema.ObjectId, ref: 'user' },
    rating: {
        total_students: {option: String, estimate: Boolean, value: String,},
        avg_batch_strength: {option: String, estimate: Boolean, value: String,},
        student_to_faculty_ratio: {option: String, estimate: Boolean, value: String,},
        avg_teacher_experience: {option: String, estimate: Boolean, value: String,},
        n_centers: {option: String, estimate: Boolean, value: String,},
        n_exams: {option: String, estimate: Boolean, value: String,},
        percent_students_selected: {option: String, estimate: Boolean, value: String,},
        ranks_top100: {option: String, estimate: Boolean, value: String,},
        ranks_top1000: {option: String, estimate: Boolean, value: String,},
        facilities:{
            printed_notes: Boolean,
            test_series: Boolean,
            dlp: Boolean,
            hostel: Boolean,
            doubt_sessions: Boolean,
            periodic_performance_tests: Boolean,
            online_lectures: Boolean,
            n_classrooms: Boolean,
            counselling: Boolean,
            entrance_test: Boolean,
        },
        examRating:[{
            exam: { type: Schema.ObjectId, ref: 'exam' },
            resultType: {type: String, default: 'CLP+DLP'},
            rating: {
                number_students_selected: {option: String, estimate: Boolean, value: String,},
                percent_students_selected: {option: String, estimate: Boolean, value: String,},
                ranks_top10: {option: String, estimate: Boolean, value: String,},
                num_nlu: {option: String, estimate: Boolean, value: String,},
                num_nlu_delhi: {option: String, estimate: Boolean, value: String,},
                ranks_top50: {option: String, estimate: Boolean, value: String,},
                ranks_top100: {option: String, estimate: Boolean, value: String,},
                ranks_top1000: {option: String, estimate: Boolean, value: String,},
                marks_gt_85: {option: String, estimate: Boolean, value: String,},
                students_percentile_100: {option: String, estimate: Boolean, value: String,},
                students_with_calls: {option: String, estimate: Boolean, value: String,},
                students_percentile_gte99: {option: String, estimate: Boolean, value: String,},
                students_percentile_gte85: {option: String, estimate: Boolean, value: String,},
                n_streams_taught: Schema.Types.Mixed,
                best_results_stream: Schema.Types.Mixed,
            }
        }],
    },
    possibleGeoCodings:{
        searched: {type: Boolean,default: false},
        _when: {type: Date},
        geocodings: [
            {
                formattedAddress: {type: String},
                latitude: {type: String},
                longitude: {type: String},
                extra: {
                    googlePlaceId: {type: String},
                    confidence: {type: String},
                    premise: {type: String},
                    subpremise: {type: String},
                    neighborhood: {type: String},
                    establishment: {type: String},
                },
                administrativeLevels:{
                    level1long: {type: String},
                    level1short: {type: String},
                    city: {type: String},
                    country: {type: String},
                    countryCode: {type: String},
                    zipcode: {type: String},
                    provider: {type: String},
                }
            }
        ],
    },
    cirf: [Schema.Types.Mixed],
    googlePlaceId:{type: String},
    
    googlePlaceId2:{type: String},
    googlePlaceId2List:[Schema.Types.Mixed],
    
    googlePlaceIdError:{type: Boolean},
    googlePlaceId2Error:{type: Boolean},
    
    multipleGooglePlaceIds:[{type: String}],
    oldGooglePlace:Schema.Types.Mixed,
    googlePlace:Schema.Types.Mixed,
    googlePlaceInfo:Schema.Types.Mixed,
    wideGeocodingSearch:{type: Boolean,default: false},
    wideGeocodings:[Schema.Types.Mixed],
    textBasedGooglePlaces:[Schema.Types.Mixed],
    textBasedGooglePlaces2:[Schema.Types.Mixed],
    newGooglePlace:Schema.Types.Mixed,
    wideGooglePlace:Schema.Types.Mixed,
    textGooglePlace:Schema.Types.Mixed,
    textGooglePlace2:Schema.Types.Mixed,
    textBasedGooglePlace:Schema.Types.Mixed,
    googlePlaceInfoAddress:Schema.Types.Mixed,
    newGooglePlaceAddress:Schema.Types.Mixed,
    wideGooglePlaceAddress:Schema.Types.Mixed,
    textGooglePlaceAddress:Schema.Types.Mixed,
    textGooglePlaceAddress2:Schema.Types.Mixed,
    manualAddress:Schema.Types.Mixed,
    sublocality:{
        level1: {type: String},
        source: {type: String},
        slug: {type: String},
    },
    oldsublocality:{
        level1: {type: String},
        source: {type: String},
        slug: {type: String},
    },
    googlePlaceSearchTry:Boolean,
    googlePlaceSearchByTextTry:Boolean,
    examCirf: Schema.Types.Mixed,
    gRank: Schema.Types.Mixed,
    gRankInfo: Schema.Types.Mixed,
    cRank: Schema.Types.Mixed,
    cRankInfo: Schema.Types.Mixed,
    tRank: Schema.Types.Mixed,
    tWithoutSponsorRank: Schema.Types.Mixed,
    cityPosition: Schema.Types.Mixed,
    seo: Schema.Types.Mixed,
    oldseos: [Schema.Types.Mixed],
    examPosition: Schema.Types.Mixed,
    n5Exam: { type: Schema.ObjectId, ref: 'exam' },
    examScores: Schema.Types.Mixed,
    sponsoredRank: Schema.Types.Mixed,
    nameslug: {type: String},
    areaslug: {type: String},
    nameareaslugs: [{type: String}],
    oldCity: {type: String},
});

coachingSchema.index({ loc: '2dsphere'});

coachingSchema.plugin(deepPopulate);
var coaching = mongoose.model('coaching', coachingSchema);


module.exports = coaching;
